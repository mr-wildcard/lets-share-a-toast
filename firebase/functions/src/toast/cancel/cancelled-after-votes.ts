import * as admin from "firebase-admin";

import { FirestoreCollection } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "../../helpers/changeMultipleSubjectsStatusAtOnce";

export function cancelledAfterVotes() {
  return admin
    .firestore()
    .collection(FirestoreCollection.SUBJECTS)
    .where("status", "==", SubjectStatus.SELECTED_FOR_NEXT_TOAST)
    .get()
    .then((snapshot) =>
      snapshot.empty ? [] : snapshot.docs.map((doc) => doc.id)
    )
    .then((subjectIds) => {
      if (subjectIds.length) {
        const subjectsStatusUpdate = changeMultipleSubjectsStatusAtOnce(
          subjectIds,
          SubjectStatus.AVAILABLE
        );

        return subjectsStatusUpdate.commit();
      }

      return;
    });
}
