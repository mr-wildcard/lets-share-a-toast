import { SubjectStatus } from "@shared/enums";

export type AllSubjectStatusesExceptSelected = Exclude<
  SubjectStatus,
  SubjectStatus.SELECTED_FOR_NEXT_TOAST
>;

export type StatusFilterValue = "all" | AllSubjectStatusesExceptSelected;
