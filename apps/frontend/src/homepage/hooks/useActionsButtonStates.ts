import { useMemo } from 'react';

import { CurrentToast, ToastStatus } from '@letsshareatoast/shared';

import toastStatusUtils from 'frontend/core/helpers/toastStatusUtils';
import isToast from 'frontend/core/helpers/isToast';
import toastHasDeadheatSubjects from 'frontend/core/helpers/toastHasDeadheatSubjects';

const useActionsButtonStates = (currentToast: CurrentToast) => {
  return useMemo(() => {
    return {
      initiateTOAST: {
        isSuccess: isToast(currentToast),
      },
      openVotes: {
        isSuccess:
          isToast(currentToast) &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
      },
      closeVotes: {
        display:
          isToast(currentToast) &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_TO_CONTRIBUTION
          ),
        isSuccess:
          isToast(currentToast) &&
          toastStatusUtils(currentToast.status).isAfter(
            ToastStatus.OPEN_FOR_VOTE
          ),
      },
      deadHeatSubjects: {
        display:
          isToast(currentToast) && toastHasDeadheatSubjects(currentToast),
      },
      markTOASTAsReady: {
        display:
          isToast(currentToast) &&
          currentToast.status === ToastStatus.VOTE_CLOSED &&
          !toastHasDeadheatSubjects(currentToast),
      },
      endTOAST: {
        display:
          isToast(currentToast) &&
          currentToast.status === ToastStatus.WAITING_FOR_TOAST,
      },
    };
  }, [currentToast]);
};

export default useActionsButtonStates;
