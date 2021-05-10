import { FirestoreSubject } from "@shared/firebase";
import { User } from "@shared/models/User";

export interface Subject extends Omit<FirestoreSubject, "speakersIds"> {
  id: string;
  speakers: User[];
}
