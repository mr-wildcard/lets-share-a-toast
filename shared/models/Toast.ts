import { DatabaseToast } from "@shared/firebase";

import { Subject } from "@shared/models/Subject";
import { User } from "@shared/models/User";

export interface Toast
  extends Omit<
    DatabaseToast,
    | "organizerId"
    | "scribeId"
    | "date"
    | "createdDate"
    | "modifiedDate"
    | "selectedSubjectIds"
  > {
  date: Date;
  createdDate: Date;
  modifiedDate: Date;
  organizer: User;
  scribe: User;
  selectedSubjects: Subject[];
}
