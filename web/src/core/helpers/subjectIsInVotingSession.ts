import { SubjectStatus, ToastStatus } from "@shared/enums";

/**
 * We don't query anything from the database to establish if a subject is included in the current toast voting session,
 * we just expect eveything's fine and base our assumptions of toast and subject statuses 🤞
 * @param toastStatus
 * @param subjectStatus
 */
export default function subjectIsInVotingSession(
  toastStatus: ToastStatus,
  subjectStatus: SubjectStatus
) {
  return (
    toastStatus === ToastStatus.OPEN_FOR_VOTE &&
    subjectStatus === SubjectStatus.AVAILABLE
  );
}
