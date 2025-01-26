import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseToast } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

import notifySlackChannel from "../../slack/notify-channel";

export const createToast = https.onCall<{
  date: number;
  organizerId: string;
  scribeId: string;
  maxSelectableSubjects: number;
  maxVotesPerUser: number;
  slackMessage?: string;
}>(async (request) => {
  logger.info("Create TOAST.");

  const initialTOAST: DatabaseToast = {
    date: request.data.date,
    status: ToastStatus.OPEN_TO_CONTRIBUTION,
    organizerId: request.data.organizerId,
    scribeId: request.data.scribeId,
    maxSelectableSubjects: request.data.maxSelectableSubjects || 2,
    maxVotesPerUser: request.data.maxVotesPerUser || 3,
    selectedSubjectIds: [],
    createdByUserId: request.auth?.uid,
    createdDate: admin.database.ServerValue.TIMESTAMP,
    modifiedDate: admin.database.ServerValue.TIMESTAMP,
    peopleCanVote: false,
  };

  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .set(initialTOAST)
    .then((result) => {
      if (request.data.slackMessage) {
        notifySlackChannel(request.data.slackMessage);
      }

      return result;
    })
    .catch((error) => {
      logger.error(
        "An error occured while creating the TOAST in Firebase",
        error,
      );
    });
});
