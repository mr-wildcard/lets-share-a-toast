import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

export const createToast = functions.https.onCall((data, context) => {
  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .set({
      date: data.date,
      status: ToastStatus.OPEN_TO_CONTRIBUTION,
      organizerId: data.organizerId,
      scribeId: data.scribeId,
      maxSelectableSubjects: data.maxSelectableSubjects || 3,
      createdByUserId: context.auth?.uid,
      createdDate: admin.database.ServerValue.TIMESTAMP,
      modifiedDate: admin.database.ServerValue.TIMESTAMP,
    });
});
