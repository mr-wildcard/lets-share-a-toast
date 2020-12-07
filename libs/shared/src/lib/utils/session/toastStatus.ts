import { ToastStatus } from '../../enums/ToastStatus';

const ToastStatusesOrder: ToastStatus[] = [
  ToastStatus.OPEN_TO_CONTRIBUTION,
  ToastStatus.OPEN_FOR_VOTE,
  ToastStatus.VOTE_CLOSED,
  ToastStatus.WAITING_FOR_TOAST,
  ToastStatus.CLOSED,
];

export const isTOASTOngoing = (toastStatus: ToastStatus) =>
  toastStatus !== ToastStatus.CLOSED && toastStatus !== ToastStatus.CANCELLED;

export const getTOASTStatusUtils = function (toastStatus: ToastStatus) {
  const toastIsOngoing = isTOASTOngoing(toastStatus);

  return {
    isBefore: (status: ToastStatus) => {
      return (
        ToastStatusesOrder.indexOf(toastStatus) <
        ToastStatusesOrder.indexOf(status)
      );
    },
    isAfter: (status: ToastStatus) => {
      return (
        ToastStatusesOrder.indexOf(toastStatus) >
        ToastStatusesOrder.indexOf(status)
      );
    },
    isAllowed(status: ToastStatus) {
      /**
       * A closed or cancelled toast can't have its status changed.
       */
      if (!toastIsOngoing) {
        return false;
      }

      /**
       * An ongoing toast can be cancelled at any time.
       */
      if (status === ToastStatus.CANCELLED) {
        return true;
      } else {
        const currentToastStatusIndex = ToastStatusesOrder.indexOf(toastStatus);
        const nextToastStatusIndex = ToastStatusesOrder.indexOf(status);

        const nextStatusIsSameThanCurrent =
          nextToastStatusIndex === currentToastStatusIndex;

        const nextStatusIsNextAllowedStatus =
          nextToastStatusIndex === currentToastStatusIndex + 1;

        /**
         * Status can be set to the toast only if it is the next
         * allowed status or the same status as the current one.
         */
        return nextStatusIsSameThanCurrent || nextStatusIsNextAllowedStatus;
      }
    },
    getNextAllowedStatus(): ToastStatus {
      if (!toastIsOngoing) {
        return toastStatus;
      } else {
        const currentToastStatusIndex = ToastStatusesOrder.indexOf(toastStatus);

        return ToastStatusesOrder[currentToastStatusIndex + 1];
      }
    },
  };
};
