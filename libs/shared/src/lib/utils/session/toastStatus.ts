import { ToastStatus } from '../../enums/ToastStatus';

const SessionStatusesOrder: ToastStatus[] = [
  ToastStatus.OPEN_TO_CONTRIBUTION,
  ToastStatus.OPEN_FOR_VOTE,
  ToastStatus.VOTE_CLOSED,
  ToastStatus.WAITING_FOR_TOAST,
  ToastStatus.CLOSED,
];

export default function getSessionStatusUtils(sessionStatus: ToastStatus) {
  return {
    isBefore: (status: ToastStatus) => {
      return (
        SessionStatusesOrder.indexOf(sessionStatus) <
        SessionStatusesOrder.indexOf(status)
      );
    },
    isAfter: (status: ToastStatus) => {
      return (
        SessionStatusesOrder.indexOf(sessionStatus) >
        SessionStatusesOrder.indexOf(status)
      );
    },
  };
}
