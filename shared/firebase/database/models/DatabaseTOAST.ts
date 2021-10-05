import { ToastStatus } from "@shared/enums/ToastStatus";

export interface DatabaseToast {
  date: number;
  organizerId: string;
  scribeId: string;
  status: ToastStatus;
  maxSelectableSubjects: number;
  maxVotesPerUser: number;
  selectedSubjectIds: string[];
  createdByUserId?: string;
  createdDate: Object;
  modifiedByUserId?: string;
  modifiedDate: Object;
  peopleCanVote: boolean;
}
