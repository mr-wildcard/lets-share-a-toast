import { ToastStatus } from "@shared/enums/ToastStatus";
import { Subject, SubjectsTotalVotes } from "@shared/models";

export interface DatabaseToast {
  date: string;
  organizerId: string;
  scribeId: string;
  status: ToastStatus;
  maxSelectableSubjects: number;
  selectedSubjects?: Subject[];
  subjects?: Subject[];
  votes?: SubjectsTotalVotes;
  createdByUserId?: string;
}
