import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

import { ToastStatus } from "@shared/enums";
import { DatabaseRefPaths } from "@shared/firebase";

import notifySlackChannel from "../../slack/notify-channel";

export const markToastAsReady = https.onCall<{ slackMessage?: string }>(
  async (request) => {
    logger.info("Mark TOAST as ready.");

    return admin
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .child("status")
      .set(ToastStatus.WAITING_FOR_TOAST)
      .then((result) => {
        if (request.data.slackMessage) {
          notifySlackChannel(request.data.slackMessage);
        }

        return result;
      })
      .catch((error) => {
        logger.error(
          "An error occured while marking the TOAST as ready",
          error,
        );
      });
  },
);
