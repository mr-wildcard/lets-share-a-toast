import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import axios from "axios";

export default function notifySlackChannel(message: string) {
  return console.warn("Call to Slack disabled.");

  const { slack } = functions.config();

  axios
    .post(slack.ekibot_url, {
      room: slack.notification_channel,
      message,
    })
    .catch((error) => {
      if (error.isAxiosError) {
        logger.error(
          `Couldn't notify Slack. HTTP error code: ${error.code}. Error message: ${error.message}`,
        );
      } else {
        logger.error("An unknown error occured while notifying Slack", error);
      }
    });
}
