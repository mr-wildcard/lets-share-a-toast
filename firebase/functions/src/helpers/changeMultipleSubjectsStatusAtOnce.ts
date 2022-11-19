import { SubjectStatus } from "@shared/enums";
import * as admin from "firebase-admin";
import { FirestoreCollection } from "@shared/firebase";

export function changeMultipleSubjectsStatusAtOnce(
  subjectIds: string[],
  newStatus: SubjectStatus
) {
  const firestore = admin.firestore();
  const subjectsCollection = firestore.collection(FirestoreCollection.SUBJECTS);
  const subjectsStatusesUpdates = firestore.batch();

  subjectIds.forEach((subjectId) => {
    const subjectRef = subjectsCollection.doc(subjectId);

    subjectsStatusesUpdates.update(subjectRef, { status: newStatus });
  });

  return subjectsStatusesUpdates;
}
