import { Toast, ToastStatus } from '@letsshareatoast/shared';

export default function toastHasDeadheatSubjects(toast: Toast) {
  return toast.status === ToastStatus.VOTE_CLOSED && false;
  // TODO: compute real boolean when API ready.
  // currentToast.subjects.length > TOTAL_NEEDED_SUBJECTS
}
