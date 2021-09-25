import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

function removeSubjectFromVotingSession(subjectId: string) {
  return admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .child(subjectId)
    .set(null);
}

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

/**
 * Watch all changes from all subjects then remove a subject
 * from voting session if its status changed
 * to a status other than AVAILABLE.
 */
export const syncSubjects = functions.firestore
  .document(`${FirestoreCollection.SUBJECTS}/{subjectId}`)
  .onWrite((change, context) => {
    /**
     * If document has been created or updated.
     */
    if (change.after.exists) {
      const subjectStatus: SubjectStatus = change.after.get("status");

      if (subjectStatus !== SubjectStatus.AVAILABLE) {
        return removeSubjectFromVotingSession(context.params.subjectId);
      }
    } else {
      /**
       * Else, document has been deleted.
       */
      const subjectStatus: SubjectStatus = change.before.get("status");

      if (subjectStatus === SubjectStatus.AVAILABLE) {
        return removeSubjectFromVotingSession(context.params.subjectId);
      } else if (subjectStatus === SubjectStatus.SELECTED_FOR_NEXT_TOAST) {
        return removeSubjectFromCurrentTOASTSelectedSubjects(
          context.params.subjectId
        );
      }
    }

    return change;
  });
