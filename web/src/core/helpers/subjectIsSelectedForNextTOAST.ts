import { SubjectStatus } from "@shared/enums";

export function subjectIsSelectedForNextTOAST(subjectStatus: SubjectStatus) {
  return subjectStatus === SubjectStatus.SELECTED_FOR_NEXT_TOAST;
}
