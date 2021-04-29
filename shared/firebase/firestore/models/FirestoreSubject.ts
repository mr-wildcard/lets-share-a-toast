import { FirestoreUser } from "@shared/firebase";
import { SubjectLanguage, SubjectStatus } from "@shared/enums";

export interface FirestoreSubject {
  title: string;
  description: string;
  speakersIds: string[];
  duration: number;
  status: SubjectStatus;
  language: SubjectLanguage;
  cover?: string;
  comment?: string;
  createdByUserId?: string;
  createdDate: string;
  lastModifiedByUserId?: string;
  lastModifiedDate: string;
}
