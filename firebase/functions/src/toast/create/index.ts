import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseToast } from "@shared/firebase";
import { ToastStatus } from "@shared/enums/ToastStatus";

import notifySlackChannel from "../../slack/notify-channel";

export const createToast = functions.https.onCall((data, context) => {
  functions.logger.info("Create TOAST.");

  const initialTOAST: DatabaseToast = {
    date: data.date,
    status: ToastStatus.OPEN_TO_CONTRIBUTION,
    organizerId: data.organizerId,
    scribeId: data.scribeId,
    maxSelectableSubjects: data.maxSelectableSubjects || 2,
    maxVotesPerUser: data.maxVotesPerUser || 3,
    selectedSubjectIds: [],
    createdByUserId: context.auth?.uid,
    createdDate: admin.database.ServerValue.TIMESTAMP,
    modifiedDate: admin.database.ServerValue.TIMESTAMP,
    peopleCanVote: false,
  };

  return admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .set(initialTOAST)
    .then((result) => {
      if (data.slackMessage) {
        notifySlackChannel(data.slackMessage);
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
