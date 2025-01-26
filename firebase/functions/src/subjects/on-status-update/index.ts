import * as firestore from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import { getCurrentTOAST } from "../../helpers/getCurrentTOAST";

function removeSubjectFromVotingSession(subjectId: string) {
  return admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .child("votes")
    .child(subjectId)
    .set(null);
}

export const syncSubjectsAfterStatusChange = firestore.onDocumentUpdated(
  `${FirestoreCollection.SUBJECTS}/{subjectId}`,
  async (event) => {
    const currentToast = await getCurrentTOAST();

    const previousSubjectStatus: SubjectStatus =
      event.data?.before.get("status");

    const newSubjectStatus: SubjectStatus = event.data?.after.get("status");

    if (
      previousSubjectStatus === SubjectStatus.AVAILABLE &&
      newSubjectStatus !== SubjectStatus.AVAILABLE &&
      currentToast.status === ToastStatus.OPEN_FOR_VOTE
    ) {
      return removeSubjectFromVotingSession(event.params.subjectId);
    }
  },
);
