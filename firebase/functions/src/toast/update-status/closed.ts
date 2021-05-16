import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

export default async function closed() {
  /**
   * Get selected subjects from TOAST
   */
  const selectedSubjectsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("selectedSubjectsIds")
    .get();

  const selectedSubjectsIds: string[] = selectedSubjectsQuery.val();

  /**
   * Update all selected subjects statuses to "DONE"
   */
  const firestore = admin.firestore();
  const subjectsCollection = firestore.collection("subjects");
  const subjectsStatusesUpdates = firestore.batch();

  selectedSubjectsIds.forEach((selectedSubjectId) => {
    const subjectRef = subjectsCollection.doc(selectedSubjectId);

    subjectsStatusesUpdates.set(subjectRef, { status: SubjectStatus.DONE });
  });

  await subjectsStatusesUpdates.commit();

  /**
   * Clear the current Toast and the voting session objects.
   */
  const databaseUpdates = {
    [DatabaseRefPaths.CURRENT_TOAST]: null,
    [DatabaseRefPaths.VOTING_SESSION]: null,
  };

  return admin.database().ref().update(databaseUpdates);
}
