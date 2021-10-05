import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import { getCurrentTOAST } from "@firebase-functions/helpers/getCurrentTOAST";

function removeSubjectFromVotingSession(subjectId: string) {
  return admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .child(subjectId)
    .set(null);
}

export const syncSubjectsAfterStatusChange = functions.firestore
  .document(`${FirestoreCollection.SUBJECTS}/{subjectId}/status`)
  .onUpdate(async (change, context) => {
    const currentToast = await getCurrentTOAST();
    const previousSubjectStatus: SubjectStatus = change.before.get("status");
    const newSubjectStatus: SubjectStatus = change.after.get("status");

    if (
      currentToast.status === ToastStatus.OPEN_FOR_VOTE &&
      previousSubjectStatus === SubjectStatus.AVAILABLE &&
      newSubjectStatus !== SubjectStatus.AVAILABLE
    ) {
      return removeSubjectFromVotingSession(context.params.subjectId);
    }
  });