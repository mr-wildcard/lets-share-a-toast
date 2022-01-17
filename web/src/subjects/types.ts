import { SubjectStatus } from "@shared/enums";

type SearchableSubjectStatuses = Exclude<
  SubjectStatus,
  SubjectStatus.SELECTED_FOR_NEXT_TOAST
>;

export type StatusFilterValue = "all" | SearchableSubjectStatuses;
