import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { ToastStatus } from "@shared/enums";

import notifySlackChannel from "../../slack/notify-channel";

export const openVotes = functions.https.onCall(async (data, context) => {
  functions.logger.info("Open voting session.");

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
      if (data.slackMessage) {
        notifySlackChannel(data.slackMessage);
      }

      return result;
    })
    .catch((error) => {
      functions.logger.error("An error occured while opening votes", error);
    });
});
