import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

import notifySlackChannel from "../../slack/notify-channel";

export const createToast = functions.https.onCall((data, context) => {
  functions.logger.info("Create TOAST.");

  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .set({
      date: data.date,
      status: ToastStatus.OPEN_TO_CONTRIBUTION,
      organizerId: data.organizerId,
      scribeId: data.scribeId,
      maxSelectableSubjects: data.maxSelectableSubjects || 2,
      createdByUserId: context.auth?.uid,
      createdDate: admin.database.ServerValue.TIMESTAMP,
      modifiedDate: admin.database.ServerValue.TIMESTAMP,
    })
    .then((result) => {
      if (data.slackMessage) {
        return notifySlackChannel(data.slackMessage);
      }

      return result;
    })
    .catch((error) => {
      functions.logger.error(
        "An error occured while creating the TOAST in Firebase",
        error
      );
    });
});
