import { useMemo } from "react";

import { CurrentToast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import toastStatusUtils from "@web/core/helpers/toastStatusUtils";
import isToast from "@web/core/helpers/isToast";
import toastHasDeadheatSubjects from "@web/core/helpers/toastHasDeadheatSubjects";

const useActionsButtonStates = (currentToast: CurrentToast) => {
  return useMemo(() => {
    const isToast = currentToast !== null;

    return {
      initiateTOAST: {
        isSuccess: isToast,
      },
      openVotes: {
        isSuccess:
          currentToast !== null &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
      },
      closeVotes: {
        display:
          currentToast !== null &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
        isSuccess:
          currentToast !== null &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_FOR_VOTE
          ),
      },
      deadHeatSubjects: {
        display:
          currentToast !== null && toastHasDeadheatSubjects(currentToast),
      },
      markTOASTAsReady: {
        display:
          currentToast !== null &&
          currentToast.status === ToastStatus.VOTE_CLOSED &&
          !toastHasDeadheatSubjects(currentToast),
      },
      endTOAST: {
        display:
          currentToast !== null &&
          currentToast.status === ToastStatus.WAITING_FOR_TOAST,
      },
    };
  }, [currentToast]);
};

export default useActionsButtonStates;
