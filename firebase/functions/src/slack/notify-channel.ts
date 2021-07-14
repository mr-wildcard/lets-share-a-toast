import * as functions from "firebase-functions";
import axios from "axios";

export default function notifySlackChannel(message: string) {
  const { slack } = functions.config();

  axios
    .post(slack.ekibot_url, {
      room: slack.notification_channel,
      message,
    })
    .catch((error) => {
      if (error.isAxiosError) {
        functions.logger.error(
          `Couldn't notify Slack. HTTP error code: ${error.code}. Error message: ${error.message}`
        );
      } else {
        functions.logger.error(
          "An unknown error occured while notifying Slack",
          error
        );
      }
    });
}
