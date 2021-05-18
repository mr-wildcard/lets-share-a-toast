import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

export const createToast = functions.https.onCall(async (data, context) => {
  try {
    await admin
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
      });
  } catch (error) {
    functions.logger.error(
      "An error occured while creating the TOAST in Firebase",
      error
    );
  }

  if (data.slackMessage) {
    try {
      const { slack } = functions.config();

      await axios.post(slack.ekibot_url, {
        room: slack.notification_channel,
        message: data.slackMessage,
      });
    } catch (error) {
      if (error.isAxiosError) {
        functions.logger.error(
          `Couldn't notify Slack on TOAST creation. HTTP error code: ${error.code}. Error message: ${error.message}`
        );
      } else {
        functions.logger.error(
          "An unknown error occured while notifying Slack of TOAST creation",
          error
        );
      }
    }
  }
});
