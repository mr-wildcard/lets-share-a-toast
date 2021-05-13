import { ToastStatus } from "@shared/enums";
import { Toast } from "@shared/models";

export default function toastHasDeadheatSubjects(toast: Toast) {
  return (
    toast.status === ToastStatus.VOTE_CLOSED &&
    toast.selectedSubjects!.length > toast.maxSelectableSubjects
  );
}
