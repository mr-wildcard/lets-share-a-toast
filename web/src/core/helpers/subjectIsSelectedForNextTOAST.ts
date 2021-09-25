import { ToastStatus } from "@shared/enums";
import { getTOASTStatusUtils } from "@shared/utils";
import { Toast } from "@shared/models";
import { toJS } from "mobx";

export function subjectIsSelectedForNextTOAST(toast: Toast, subjectId: string) {
  return (
    getTOASTStatusUtils(toast.status).isAfter(ToastStatus.OPEN_FOR_VOTE) &&
    !!toast.selectedSubjects.find((subject) => subject.id === subjectId)
  );
}
