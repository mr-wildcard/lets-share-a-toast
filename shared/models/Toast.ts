import { DatabaseToast } from "@shared/firebase";

export interface Toast
  extends Omit<DatabaseToast, "date" | "createdDate" | "modifiedDate"> {
  date: Date;
  createdDate: Date;
  modifiedDate: Date;
}
