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

/**
 * Watch all changes from all subjects then remove it from voting session
 * if status changed from AVAILABLE.
 */
export const syncSubjectsWithVotes = functions.firestore
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
      }
    }

    return change;
  });
