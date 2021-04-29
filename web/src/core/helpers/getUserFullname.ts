import { FirestoreUser } from "@shared/firebase";

export default function getUserFullname(user: FirestoreUser) {
  return user.displayName || `USER_WITHOUT_DISPLAY_NAME: ${user.uid}`;
}
