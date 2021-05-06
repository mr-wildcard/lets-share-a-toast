import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";

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
   * Retrieve voting session.
   */
  const resultsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .get();

  const result: DatabaseVotingSession = resultsQuery.val();

  /**
   * Update current TOAST with selected subjects.
   */
  return admin.database().ref(DatabaseRefPaths.CURRENT_TOAST).update({
    selectedSubjects: result,
  });
}
