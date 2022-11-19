import * as functions from "firebase-functions";
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
          (subjectIds) => subjectIds !== subjectId
        );
      }

      return selectedSubjectIds;
    });
}

export const syncDeletedSubjects = functions.firestore
  .document(`${FirestoreCollection.SUBJECTS}/{subjectId}`)
  .onDelete(async (change, context) => {
    const subjectStatus: SubjectStatus = change.get("status");

    if (subjectStatus === SubjectStatus.SELECTED_FOR_NEXT_TOAST) {
      return removeSubjectFromCurrentTOASTSelectedSubjects(
        context.params.subjectId
      );
    }
  });
