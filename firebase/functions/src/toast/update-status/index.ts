import * as functions from "firebase-functions";

import { DatabaseRefPaths } from "@shared/firebase";
import { ToastStatus } from "@shared/enums";

import voteOpened from "./vote-opened";
import voteClosed from "./vote-closed";
import closed from "./closed";
import cancelledWhileVoting from "./cancelled-while-voting";

export const onToastStatusUpdate = functions.database
  .ref(`${DatabaseRefPaths.CURRENT_TOAST}/status`)
  .onUpdate((change) => {
    const beforeStatus: ToastStatus = change.before.val();
    const newStatus: ToastStatus = change.after.val();

    switch (newStatus) {
      case ToastStatus.OPEN_FOR_VOTE: {
        functions.logger.info("Create voting session.");

        return voteOpened()
          .then(() => {
            functions.logger.info("Voting session successfully opened.");
          })
          .catch((error) => {
            functions.logger.error(error);
          });
      }

      case ToastStatus.VOTE_CLOSED: {
        functions.logger.info("Close voting session.");

        return voteClosed()
          .then(() => {
            functions.logger.info("Voting session successfully closed.");
          })
          .catch((error) => {
            functions.logger.error(error);
          });
      }

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
        }
      }

      case ToastStatus.CLOSED: {
        functions.logger.info("TOAST closed.");

        return closed()
          .then(() => {
            functions.logger.info(
              "Current TOAST and Voting session objects cleared."
            );
          })
          .catch((error) => {
            functions.logger.error(error);
          });
      }

      default: {
        return;
      }
    }
  });
