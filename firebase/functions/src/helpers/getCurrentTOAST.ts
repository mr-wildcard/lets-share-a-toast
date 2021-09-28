import * as admin from "firebase-admin";

import { Toast } from "@shared/models";
import { DatabaseRefPaths } from "@shared/firebase";

export async function getCurrentTOAST(): Promise<Toast> {
  const currentToastQuery = await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .get();

  return currentToastQuery.val();
}
