import { FirestoreSubject } from "@shared/firebase";
import { User } from "@shared/models/User";

type SubjectWithoutFirebaseProperties = Omit<
  FirestoreSubject,
  | "speakersIds"
  | "createdDate"
  | "lastModifiedDate"
  | "createdByUserId"
  | "lastModifiedByUserId"
>;

export interface Subject extends SubjectWithoutFirebaseProperties {
  id: string;
  speakers: User[];
  createdDate: Date;
  createdByUser: User;
  lastModifiedDate: Date;
  lastModifiedByUser: User;
}
