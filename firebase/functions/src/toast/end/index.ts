import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

export const endToast = functions.https.onCall(async (data, context) => {
  /**
   * Get selected subjects from TOAST
   */
  const selectedSubjectsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("selectedSubjectIds")
    .get();

  const selectedSubjectIds: string[] = selectedSubjectsQuery.val();

  /**
   * Update all selected subjects statuses to "DONE"
   */
  const firestore = admin.firestore();
  const subjectsCollection = firestore.collection("subjects");
  const subjectsStatusesUpdates = firestore.batch();

  selectedSubjectIds.forEach((selectedSubjectId) => {
    const subjectRef = subjectsCollection.doc(selectedSubjectId);

    subjectsStatusesUpdates.update(subjectRef, { status: SubjectStatus.DONE });
  });

  /**
   * Clear the current Toast and the voting session objects.
   */
  const databaseUpdates = {
    [DatabaseRefPaths.CURRENT_TOAST]: null,
    [DatabaseRefPaths.VOTING_SESSION]: null,
  };

  return Promise.all([
    subjectsStatusesUpdates.commit(),
    admin.database().ref().update(databaseUpdates),
  ]).catch((error) => {
    functions.logger.error(
      "An error occured while ending the TOAST in Firebase",
      error
    );
  });
});
