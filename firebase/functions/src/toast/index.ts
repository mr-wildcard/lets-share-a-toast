import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseToast } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

export const createToast = functions.https.onCall((data, context) => {
  const toast: DatabaseToast = {
    status: ToastStatus.OPEN_TO_CONTRIBUTION,
    date: data.date,
    organizerId: data.organizerId,
    scribeId: data.scribeId,
    maxSelectableSubjects: data.maxSelectableSubjects || 3,
    createdByUserId: context.auth?.uid,
  };

  return admin.database().ref(DatabaseRefPaths.CURRENT_TOAST).set(toast);
});
