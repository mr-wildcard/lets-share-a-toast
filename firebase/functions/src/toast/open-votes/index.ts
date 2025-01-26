import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { ToastStatus } from "@shared/enums";

import notifySlackChannel from "../../slack/notify-channel";

export const openVotes = https.onCall(async (request) => {
  logger.info("Open voting session.");

  /**
   * Create a voting session object ready to be stored in
   * realtime database.
   */
  const votingSession: DatabaseVotingSession = {
    votes: {},
  };

  /**
   * Persist new TOAST status and voting session object into realtime database.
   */
  return admin
    .database()
    .ref()
    .update({
      [`${DatabaseRefPaths.CURRENT_TOAST}/status`]: ToastStatus.OPEN_FOR_VOTE,
      [`${DatabaseRefPaths.CURRENT_TOAST}/peopleCanVote`]: true,
      [DatabaseRefPaths.VOTING_SESSION]: votingSession,
    })
    .then((result) => {
      if (request.data.slackMessage) {
        notifySlackChannel(request.data.slackMessage);
      }

      return result;
    })
    .catch((error) => {
      logger.error("An error occured while opening votes", error);
    });
});
