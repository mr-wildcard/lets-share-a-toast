import * as admin from "firebase-admin";

import { DatabaseRefPaths, SubjectsVotes } from "@shared/firebase";
import { getSubjectTotalVotes } from "@shared/utils";

export default async function voteClosed() {
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
    .sort()
    .reverse();

  const selectedSubjects: string[] = [];

  for (let i = 0; i < allSortedTotalVotes.length; i++) {
    /**
     * If `selectedSubjectIds` array was filled with enough subject ids
     * during the previous loop, we don't need to iterate further.
     */
    if (selectedSubjects.length >= maxSelectableSubjects) {
      break;
    }

    const totalVotes = allSortedTotalVotes[i];

    /**
     * Find all subjects with this amount of total votes.
     */
    allSubjectsVotes.forEach((subjectVotes) => {
      const [subjectId, subjectTotalVotes] = subjectVotes;

      if (subjectTotalVotes === totalVotes) {
        selectedSubjects.push(subjectId);
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
  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("selectedSubjectIds")
    .set(selectedSubjects);
}
