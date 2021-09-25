import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "@firebase-functions/helpers/changeMultipleSubjectsStatusAtOnce";

export const endToast = functions.https.onCall(async (data, context) => {
  /**
   * Get selected subjects from TOAST
   */
  const selectedSubjectsQuery = await admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .child("selectedSubjectIds")
    .get();

  const selectedSubjectIds: string[] = selectedSubjectsQuery.val();

  /**
   * Update all selected subjects statuses to "DONE"
   */
  const subjectsStatusesUpdates = changeMultipleSubjectsStatusAtOnce(
    selectedSubjectIds,
    SubjectStatus.DONE
  );

  return Promise.all([
    subjectsStatusesUpdates.commit(),
    admin.database().ref().set(null),
  ]).catch((error) => {
    functions.logger.error(
      "An error occured while ending the TOAST in Firebase",
      error
    );
  });
});
