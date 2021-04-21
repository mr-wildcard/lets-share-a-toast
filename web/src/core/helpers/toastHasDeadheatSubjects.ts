import { Toast, ToastStatus } from '@shared';

export default function toastHasDeadheatSubjects(toast: Toast) {
  return (
    toast.status === ToastStatus.VOTE_CLOSED &&
    toast.selectedSubjects.length > toast.maxSelectableSubjects
  );
}
