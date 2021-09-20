import { ToastStatus } from "@shared/enums/ToastStatus";
import { SubjectsTotalVotes } from "@shared/firebase";

export interface DatabaseToast {
  date: number;
  organizerId: string;
  scribeId: string;
  status: ToastStatus;
  maxSelectableSubjects: number;
  selectedSubjectIds?: string[];
  votes?: SubjectsTotalVotes;
  createdByUserId?: string;
  createdDate: number;
  modifiedByUserId?: string;
  modifiedDate: number;
}
