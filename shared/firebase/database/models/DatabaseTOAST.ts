import { ToastStatus } from "@shared/enums/ToastStatus";
import { Subject } from "@shared/models";
import { SubjectsTotalVotes } from "@shared/firebase";

export interface DatabaseToast {
  date: number;
  organizerId: string;
  scribeId: string;
  status: ToastStatus;
  maxSelectableSubjects: number;
  selectedSubjectsIds?: string[];
  subjects?: string[];
  votes?: SubjectsTotalVotes;
  createdByUserId?: string;
  createdDate: number;
  modifiedByUserId?: string;
  modifiedDate: number;
}
