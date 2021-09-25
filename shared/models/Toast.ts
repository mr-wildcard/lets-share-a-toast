import { DatabaseToast } from "@shared/firebase";

import { Subject } from "@shared/models/Subject";
import { User } from "@shared/models/User";

type TOASTWithoutFirebaseProperties = Omit<
  DatabaseToast,
  | "organizerId"
  | "scribeId"
  | "date"
  | "createdDate"
  | "modifiedDate"
  | "selectedSubjectIds"
>;

export interface Toast extends TOASTWithoutFirebaseProperties {
  date: Date;
  createdDate: Date;
  modifiedDate: Date;
  organizer: User;
  scribe: User;
  selectedSubjects: Subject[];
}
