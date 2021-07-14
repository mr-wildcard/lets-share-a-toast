import * as functions from "firebase-functions";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums";

import cancelledWhileVoting from "./cancelled-while-voting";

export const onToastStatusUpdate = functions.database
  .ref(`${DatabaseRefPaths.CURRENT_TOAST}/status`)
  .onUpdate((change) => {
    const beforeStatus: ToastStatus = change.before.val();
    const newStatus: ToastStatus = change.after.val();

    switch (newStatus) {
      case ToastStatus.CANCELLED: {
        functions.logger.info("TOAST cancelled.");

        if (beforeStatus === ToastStatus.OPEN_FOR_VOTE) {
          functions.logger.info("TOAST cancelled while votes where opened.");

          return cancelledWhileVoting()
            .then(() => {
              functions.logger.info(
                "Voting session object successfully cleared."
              );
            })
            .catch((error) => {
              functions.logger.error(error);
            });
        } else {
          return;
        }
      }

      default: {
        return functions.logger.info("TOAST status changed to", newStatus);
      }
    }
  });