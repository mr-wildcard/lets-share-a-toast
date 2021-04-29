import { SubjectStatus } from "@shared/enums/SubjectStatus";
import { SubjectLanguage } from "@shared/enums/SubjectLanguage";
import { FirestoreSubject } from "@shared/firebase";

export interface Subject extends FirestoreSubject {
  id: string;
}
