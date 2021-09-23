import { SubjectStatus, ToastStatus } from "@shared/enums";
import { getTOASTStatusUtils } from "@shared/utils";
import { Toast } from "@shared/models";

/**
 * We don't query anything from the database to establish if a subject is included in the current toast voting session,
 * we just expect eveything's fine and base our assumptions of toast and subject statuses 🤞
 * @param toastStatus
 * @param subjectStatus
 */
export function subjectIsSelectedForNextTOAST(toast: Toast, subjectId: string) {
  return (
    getTOASTStatusUtils(toast.status).isAfter(ToastStatus.OPEN_FOR_VOTE) &&
    !!toast.selectedSubjects?.find((subject) => subject.id === subjectId)
  );
}
