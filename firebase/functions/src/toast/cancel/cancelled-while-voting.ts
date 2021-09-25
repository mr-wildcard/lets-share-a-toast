import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";

export function cancelledWhileVoting() {
  /**
   * Clear the voting session object if Current TOAST was cancelled
   * while voting session was opened.
   */
  return admin.database().ref(DatabaseRefPaths.VOTING_SESSION).set(null);
}
