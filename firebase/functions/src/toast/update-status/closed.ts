import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";

export default function closed() {
  const updates = {
    [DatabaseRefPaths.CURRENT_TOAST]: null,
    [DatabaseRefPaths.VOTING_SESSION]: null,
  };

  return admin.database().ref().update(updates);
}
