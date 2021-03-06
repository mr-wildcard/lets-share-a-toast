import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { SubjectStatus, ToastStatus } from "@shared/enums";
import { getTOASTStatusUtils } from "@shared/utils";
import { Toast } from "@shared/models";

import { getCurrentTOAST } from "../../helpers/getCurrentTOAST";
import { cancelledAfterVotes } from "./cancelled-after-votes";

export const cancelToast = functions.https.onCall(async () => {
  functions.logger.info("Cancelling TOAST...");

  const currentToast: Toast = await getCurrentTOAST();

  const toastStatusUtil = getTOASTStatusUtils(currentToast.status);

  const cancelActions: Promise<unknown>[] = [admin.database().ref().set(null)];

  if (toastStatusUtil.isAfter(ToastStatus.OPEN_FOR_VOTE)) {
    functions.logger.info(
      `TOAST is about to be cancelled after votes have been closed. Selected subjects status need to be set back to ${SubjectStatus.AVAILABLE}`
    );

    cancelActions.push(cancelledAfterVotes());
  }

  return Promise.all(cancelActions).catch((error) => {
    functions.logger.error("An error occured while canceling the TOAST", error);
  });
});
