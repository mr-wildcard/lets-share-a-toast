import { FirestoreUser } from "@shared/firebase";

export interface User extends FirestoreUser {
  id: string;
}
