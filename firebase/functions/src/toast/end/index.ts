import * as https from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

import { DatabaseRefPaths } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "../../helpers/changeMultipleSubjectsStatusAtOnce";

export const endToast = https.onCall<{ givenSubjectsIds: string[] }>(
  async (request) => {
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
     * Update all given subject statuses to "DONE"
     */
    const doneSubjectsStatusesUpdates = changeMultipleSubjectsStatusAtOnce(
      request.data.givenSubjectsIds,
      SubjectStatus.DONE,
    );

    const requests: Promise<unknown>[] = [doneSubjectsStatusesUpdates.commit()];

    /**
     * Update all subjects which have not been given to AVAILABLE again
     */
    const notGivenSubjectIds = selectedSubjectIds.filter(
      (subjectId) => !request.data.givenSubjectsIds.includes(subjectId),
    );

    if (notGivenSubjectIds.length > 0) {
      const availableSubjectsStatusesUpdates =
        changeMultipleSubjectsStatusAtOnce(
          notGivenSubjectIds,
          SubjectStatus.AVAILABLE,
        );

      requests.push(availableSubjectsStatusesUpdates.commit());
    }

    requests.push(admin.database().ref().set(null));

    return Promise.all(requests).catch((error) => {
      logger.error(
        "An error occured while ending the TOAST in Firebase",
        error,
      );
    });
  },
);
