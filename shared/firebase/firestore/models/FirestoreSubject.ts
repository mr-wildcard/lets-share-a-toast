import { SubjectLanguage, SubjectStatus } from "@shared/enums";
import { FirestoreTimestamp } from "@shared/firebase/firestore/models/FirestoreTimestamp";

export interface FirestoreSubject {
  title: string;
  description: string;
  speakersIds: string[];
  duration: number;
  status: SubjectStatus;
  language: SubjectLanguage;
  cover?: string;
  comment?: string;
  createdDate: FirestoreTimestamp;
  createdByUserId?: string;
  lastModifiedDate: FirestoreTimestamp;
  lastModifiedByUserId?: string;
}
