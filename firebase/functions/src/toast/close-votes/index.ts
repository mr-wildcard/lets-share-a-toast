import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { getSelectedSubjectIds } from "@shared/utils";
import { ToastStatus } from "@shared/enums";

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
    .child("maxSelectableSubjects");

  /**
   * Retrieve voting session.
   */
  const resultsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes");

  /**
   * Parallelize requests.
   */
  const [votes, maxSelectableSubjects] = await Promise.all([
    resultsQuery.get(),
    maxSelectableSubjectsQuery.get(),
  ]);

  /**
   * Compute selected subject IDs only if some votes have been submitted.
   */
  const selectedSubjectIds = votes.exists()
    ? getSelectedSubjectIds(votes.val(), maxSelectableSubjects.val())
    : [];

  /**
   * Update current TOAST with selected subjects.
   */
  const updates = {
    status: ToastStatus.VOTE_CLOSED,
    selectedSubjectIds: selectedSubjectIds,
  };

  return admin.database().ref(DatabaseRefPaths.CURRENT_TOAST).update(updates);
});
