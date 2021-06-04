import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums";

export const resolveDeadheatSubjects = functions.https.onCall((data) => {
  return admin.database().ref(DatabaseRefPaths.CURRENT_TOAST).update({
    selectedSubjectIds: data.selectedSubjectIds,
    status: ToastStatus.WAITING_FOR_TOAST,
  });
});
