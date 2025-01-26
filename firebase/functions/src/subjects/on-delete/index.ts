import * as firestore from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

function removeSubjectFromCurrentTOASTSelectedSubjects(subjectId: string) {
  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("selectedSubjectIds")
    .transaction((selectedSubjectIds: string[]) => {
      if (selectedSubjectIds.includes(subjectId)) {
        return selectedSubjectIds.filter(
          (subjectIds) => subjectIds !== subjectId,
        );
      }

      return selectedSubjectIds;
    });
}

export const syncDeletedSubjects = firestore.onDocumentDeleted(
  `${FirestoreCollection.SUBJECTS}/{subjectId}`,
  async (event) => {
    const subjectStatus: SubjectStatus = event.data?.get("status");

    if (subjectStatus === SubjectStatus.SELECTED_FOR_NEXT_TOAST) {
      return removeSubjectFromCurrentTOASTSelectedSubjects(
        event.params.subjectId,
      );
    }
  },
);
