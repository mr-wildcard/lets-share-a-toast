import { ToastStatus } from "../../enums/ToastStatus";

const ToastStatusesOrder: ToastStatus[] = [
  ToastStatus.OPEN_TO_CONTRIBUTION,
  ToastStatus.OPEN_FOR_VOTE,
  ToastStatus.VOTE_CLOSED,
  ToastStatus.WAITING_FOR_TOAST,
  ToastStatus.CLOSED,
];

type NotCancelledTOASTStatus = Exclude<ToastStatus, ToastStatus.CANCELLED>;

export function isTOASTOngoing(toastStatus: ToastStatus) {
  return (
    toastStatus !== ToastStatus.CLOSED && toastStatus !== ToastStatus.CANCELLED
  );
}

export function getTOASTStatusUtils(toastStatus: ToastStatus) {
  const toastIsOngoing = isTOASTOngoing(toastStatus);

  return {
    isBefore: (status: NotCancelledTOASTStatus) => {
      return (
        ToastStatusesOrder.indexOf(toastStatus) <
        ToastStatusesOrder.indexOf(status)
      );
    },
    isAfter: (status: NotCancelledTOASTStatus) => {
      return (
        ToastStatusesOrder.indexOf(toastStatus) >
        ToastStatusesOrder.indexOf(status)
      );
    },
    isNextAllowedStatus(status: ToastStatus) {
      /**
       * A closed or cancelled toast can't have its status changed.
       */
      if (!toastIsOngoing) {
        return false;
      } else if (status === ToastStatus.CANCELLED) {
        /**
         * An ongoing toast can be cancelled at any time.
         */
        return true;
      } else if (status === toastStatus) {
        /**
         * Setting toast status to the same statu is allowed.
         */
        return true;
      } else {
        const currentToastStatusIndex = ToastStatusesOrder.indexOf(toastStatus);
        const nextToastStatusIndex = ToastStatusesOrder.indexOf(status);

        /**
         * Status is allowed only if it is the next status in a life of a TOAST.
         */
        return nextToastStatusIndex === currentToastStatusIndex + 1;
      }
    },
  };
}
