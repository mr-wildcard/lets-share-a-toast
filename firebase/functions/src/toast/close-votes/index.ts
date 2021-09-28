import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, SubjectsVotes } from "@shared/firebase";
import { getSelectedSubjectIds } from "@shared/utils";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "@firebase-functions/helpers/changeMultipleSubjectsStatusAtOnce";

export const closeVotes = functions.https.onCall(async () => {
  functions.logger.info("Close voting session.");

  /**
   * Prevent people from voting.
   */
  await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("peopleCanVote")
    .set(false);

  /**
   * Retrieve the total of subjects that will be
   * presented during the next TOAST.
   */
  const maxSelectableSubjectsQuery = admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("maxSelectableSubjects")
    .get();

  /**
   * Retrieve voting session.
   */
  const resultsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .get();

  /**
   * Parallelize requests.
   */
  const [votesValue, maxSelectableSubjectsValue] = await Promise.all([
    resultsQuery,
    maxSelectableSubjectsQuery,
  ]);

  const votes: SubjectsVotes = votesValue.val();
  const maxSelectableSubjects: number = maxSelectableSubjectsValue.val();

  /**
   * Compute selected subject IDs only if some votes have been submitted.
   */
  const selectedSubjectIds = votesValue.exists()
    ? getSelectedSubjectIds(votes, maxSelectableSubjects)
    : [];

  /**
   * Update current TOAST with selected subjects.
   */
  const updateCurrentTOAST = admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .update({
      status: ToastStatus.VOTE_CLOSED,
      selectedSubjectIds,
    });

  /**
   * Change statuses of all selected subjects to {SubjectStatus.SELECTED_FOR_NEXT_TOAST}
   */
  const subjectsStatusChanges = changeMultipleSubjectsStatusAtOnce(
    selectedSubjectIds,
    SubjectStatus.SELECTED_FOR_NEXT_TOAST
  );

  return Promise.all([
    updateCurrentTOAST,
    subjectsStatusChanges.commit(),
  ]).catch((error) => {
    functions.logger.error("An error occured while closing votes", error);
  });
});
