import { DatabaseToast } from "@shared/firebase";

import { Subject } from "@shared/models/Subject";

export interface Toast
  extends Omit<
    DatabaseToast,
    "date" | "createdDate" | "modifiedDate" | "selectedSubjects"
  > {
  date: Date;
  createdDate: Date;
  modifiedDate: Date;
  selectedSubjects: Subject[];
}
