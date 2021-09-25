import * as functions from "firebase-functions";

import { DatabaseRefPaths } from "@shared/firebase";
import { SubjectStatus, ToastStatus } from "@shared/enums";
import { getTOASTStatusUtils } from "@shared/utils";
import { Toast } from "@shared/models";

import { cancelledWhileVoting } from "./cancelled-while-voting";
import { cancelledAfterVotes } from "./cancelled-after-votes";

export const onCurrentToastDeleted = functions.database
  .ref(DatabaseRefPaths.CURRENT_TOAST)
  .onDelete((change) => {
    const beforeValue: Toast = change.val();

    const beforeStatusUtil = getTOASTStatusUtils(beforeValue.status);

    if (beforeValue.status === ToastStatus.OPEN_FOR_VOTE) {
      functions.logger.info("TOAST cancelled while votes where opened.");

      return cancelledWhileVoting()
        .then(() => {
          functions.logger.info("Voting session object successfully cleared.");
        })
        .catch((error) => {
          functions.logger.error(error);
        });
    } else if (beforeStatusUtil.isAfter(ToastStatus.OPEN_FOR_VOTE)) {
      return cancelledAfterVotes()
        .then(() => {
          functions.logger.info(
            `Subjects that was previously in the voting session have their status set back to ${SubjectStatus.AVAILABLE}.`
          );
        })
        .catch((error) => {
          functions.logger.error(error);
        });
    } else {
      return change;
    }
  });
