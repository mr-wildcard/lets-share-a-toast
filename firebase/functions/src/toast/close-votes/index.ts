import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
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

  return Promise.all([updateCurrentTOAST, subjectsStatusChanges.commit()]);
});
