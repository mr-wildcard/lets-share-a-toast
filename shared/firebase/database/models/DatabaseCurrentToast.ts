import { ToastStatus } from "@shared/enums/ToastStatus";
import { FirestoreUser } from "@shared/firebase";

export interface DatabaseCurrentToast {
  date: string;
  organizerId: FirestoreUser;
  scribeId: FirestoreUser;
  status: ToastStatus;
  maxSelectableSubjects: number;
}
