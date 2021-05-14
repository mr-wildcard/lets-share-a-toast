import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
  DatabaseRefPaths,
  SubjectsTotalVotes,
  SubjectsVotes,
} from "@shared/firebase";
import { ToastStatus } from "@shared/enums";
import { getSubjectTotalVotes, unique } from "@shared/utils";

import voteOpened from "./vote-opened";
import closed from "./closed";
import cancelledWhileVoting from "./cancelled-while-voting";

export const onToastStatusUpdate = functions.database
  .ref(`${DatabaseRefPaths.CURRENT_TOAST}/status`)
  .onUpdate((change) => {
    const beforeStatus: ToastStatus = change.before.val();
    const newStatus: ToastStatus = change.after.val();

    switch (newStatus) {
      case ToastStatus.OPEN_FOR_VOTE: {
        functions.logger.info("Create voting session.");

        return voteOpened()
          .then(() => {
            functions.logger.info("Voting session successfully opened.");
          })
          .catch((error) => {
            functions.logger.error(error);
          });
      }

      case ToastStatus.CANCELLED: {
        functions.logger.info("TOAST cancelled.");

        if (beforeStatus === ToastStatus.OPEN_FOR_VOTE) {
          functions.logger.info("TOAST cancelled while votes where opened.");

          return cancelledWhileVoting()
            .then(() => {
              functions.logger.info(
                "Voting session object successfully cleared."
              );
            })
            .catch((error) => {
              functions.logger.error(error);
            });
        } else {
          return;
        }
      }

      case ToastStatus.CLOSED: {
        functions.logger.info("TOAST closed.");

        return closed()
          .then(() => {
            functions.logger.info(
              "Current TOAST and Voting session objects cleared."
            );
          })
          .catch((error) => {
            functions.logger.error(error);
          });
      }

      default: {
        return functions.logger.info("TOAST status changed to", newStatus);
      }
    }
  });

export const closeVotes = functions.https.onCall(async () => {
  functions.logger.info("Close voting session.");

  /**
   * Prevent people from voting.
   */
  await admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("peopleCanVote")
    .set(false);

  /**
   * Retrieve the total of subjects that will be
   * presented during the next TOAST.
   */
  const maxSelectableSubjectsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("maxSelectableSubjects")
    .get();

  const maxSelectableSubjects = maxSelectableSubjectsQuery.val();

  /**
   * Retrieve voting session.
   */
  const resultsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .get();

  const votes: SubjectsVotes = resultsQuery.val();

  const allVotes = Object.entries(votes);

  type AllSubjectsVotes = Array<[string, number]>;

  const allSubjectsVotes: AllSubjectsVotes = allVotes.map(
    ([subjectId, subjectVotes]) => [
      subjectId,
      getSubjectTotalVotes(subjectVotes),
    ]
  );

  const allSortedTotalVotes = allSubjectsVotes
    .map(([, subjectTotalVotes]) => subjectTotalVotes)
    .filter(unique)
    .sort()
    .reverse();

  const selectedSubjectsIds: string[] = [];

  for (let i = 0; i < allSortedTotalVotes.length; i++) {
    /**
     * If `selectedSubjectIds` array was filled with enough subject ids
     * during the previous loop, we don't need to iterate further.
     */
    if (selectedSubjectsIds.length >= maxSelectableSubjects) {
      break;
    }

    const totalVotes = allSortedTotalVotes[i];

    /**
     * Find all subjects with this amount of total votes.
     */
    allSubjectsVotes.forEach((subjectVotes) => {
      const [subjectId, subjectTotalVotes] = subjectVotes;

      if (subjectTotalVotes === totalVotes) {
        selectedSubjectsIds.push(subjectId);
      }
    });
  }

  /**
   * Update current TOAST with selected subjects.
   * There might be more than the total allowed,
   * but it is the frontend job to display the correct modal to TOAST
   * organizer so that it can decide which subjects will be presented
   * during the TOAST.
   */
  const updates = {
    status: ToastStatus.VOTE_CLOSED,
    "/selectedSubjectIds": selectedSubjectsIds,
    "/votes": allSubjectsVotes.reduce(
      (
        subjectsTotalVotes: SubjectsTotalVotes,
        subjectVotes: [string, number]
      ) => {
        const [subjectId, subjectTotalVotes] = subjectVotes;

        subjectsTotalVotes[subjectId] = subjectTotalVotes;

        return subjectsTotalVotes;
      },
      {}
    ),
  };

  return admin.database().ref(DatabaseRefPaths.CURRENT_TOAST).update(updates);
});
