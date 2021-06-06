import { useMemo } from "react";

import { CurrentToast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import toastStatusUtils from "@web/core/helpers/toastStatusUtils";
import isToast from "@web/core/helpers/isToast";
import toastHasDeadheatSubjects from "@web/core/helpers/toastHasDeadheatSubjects";

const useActionsButtonStates = (currentToast: CurrentToast) => {
  return useMemo(() => {
    const isToast = !!currentToast;

    return {
      initiateTOAST: {
        isSuccess: isToast,
      },
      openVotes: {
        display:
          !!currentToast &&
          currentToast.status === ToastStatus.OPEN_TO_CONTRIBUTION,
        isSuccess:
          !!currentToast &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
      },
      closeVotes: {
        display:
          !!currentToast &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
        isSuccess:
          !!currentToast &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_FOR_VOTE
          ),
      },
      deadHeatSubjects: {
        display: !!currentToast && toastHasDeadheatSubjects(currentToast),
      },
      markTOASTAsReady: {
        display:
          !!currentToast &&
          currentToast.status === ToastStatus.VOTE_CLOSED &&
          !toastHasDeadheatSubjects(currentToast),
      },
      endTOAST: {
        display:
          !!currentToast &&
          currentToast.status === ToastStatus.WAITING_FOR_TOAST,
      },
    };
  }, [currentToast]);
};

export default useActionsButtonStates;
