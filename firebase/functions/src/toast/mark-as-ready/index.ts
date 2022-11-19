import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { ToastStatus } from "@shared/enums";
import { DatabaseRefPaths } from "@shared/firebase";

import notifySlackChannel from "../../slack/notify-channel";

export const markToastAsReady = functions.https.onCall(
  async (data, context) => {
    functions.logger.info("Mark TOAST as ready.");

    return admin
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .child("status")
      .set(ToastStatus.WAITING_FOR_TOAST)
      .then((result) => {
        if (data.slackMessage) {
          notifySlackChannel(data.slackMessage);
        }

        return result;
      })
      .catch((error) => {
        functions.logger.error(
          "An error occured while marking the TOAST as ready",
          error
        );
      });
  }
);
