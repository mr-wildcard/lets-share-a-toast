import { ToastStatus } from '@letsshareatoast/shared';

const ToastStatusesOrder: ToastStatus[] = [
  ToastStatus.OPEN_TO_CONTRIBUTION,
  ToastStatus.OPEN_FOR_VOTE,
  ToastStatus.VOTE_CLOSED,
  ToastStatus.WAITING_FOR_TOAST,
  ToastStatus.CLOSED,
];

export default function getToastStatusUtils(toastStatus: ToastStatus) {
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
  };
}
