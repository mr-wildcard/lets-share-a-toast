import { Machine } from 'xstate';

import { ToastStatus } from '@letsshareatoast/shared';

export const toastStatusMachine = (initialStatus: ToastStatus) =>
  Machine({
    initial: initialStatus,
    states: {
      [ToastStatus.OPEN_TO_CONTRIBUTION]: {
        on: {
          nextStatus: ToastStatus.OPEN_FOR_VOTE,
          cancel: ToastStatus.CANCELLED,
        },
      },
      [ToastStatus.OPEN_FOR_VOTE]: {
        on: {
          nextStatus: ToastStatus.VOTE_CLOSED,
          cancel: ToastStatus.CANCELLED,
        },
      },
      [ToastStatus.VOTE_CLOSED]: {
        on: {
          nextStatus: ToastStatus.WAITING_FOR_TOAST,
          cancel: ToastStatus.CANCELLED,
        },
      },
      [ToastStatus.WAITING_FOR_TOAST]: {
        on: {
          nextStatus: ToastStatus.CLOSED,
          cancel: ToastStatus.CANCELLED,
        },
      },
      [ToastStatus.CLOSED]: {
        type: 'final',
      },
      [ToastStatus.CANCELLED]: {
        type: 'final',
      },
    },
  });
