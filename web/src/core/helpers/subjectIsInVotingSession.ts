import { SubjectStatus, ToastStatus } from "@shared/enums";

export default function subjectIsInVotingSession(
  toastStatus: ToastStatus,
  subjectStatus: SubjectStatus
) {
  return (
    toastStatus === ToastStatus.OPEN_FOR_VOTE &&
    subjectStatus === SubjectStatus.AVAILABLE
  );
}
