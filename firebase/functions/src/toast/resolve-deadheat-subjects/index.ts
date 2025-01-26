import * as https from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "../../helpers/changeMultipleSubjectsStatusAtOnce";

export const resolveDeadheatSubjects = https.onCall<{
  selectedSubjectIds: string[];
}>(async (request) => {
  const updateCurrentToast = admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .update({
      selectedSubjectIds: request.data.selectedSubjectIds,
      status: ToastStatus.WAITING_FOR_TOAST,
    });

  /**
   * Selected subjects are selected after closing the votes.
   * But after resolving dead heat subjects votes, some ends up not being selected
   * for the next TOAST anymore.
   */
  const subjectsSelectedForNextTOASTQuery = await admin
    .firestore()
    .collection(FirestoreCollection.SUBJECTS)
    .where("status", "==", SubjectStatus.SELECTED_FOR_NEXT_TOAST)
    .get();

  const subjectsIDsWithStatusSelectedForNextTOAST =
    subjectsSelectedForNextTOASTQuery.docs.map((doc) => doc.id);

  const subjectIDsNotSelectedForNextTOAST =
    subjectsIDsWithStatusSelectedForNextTOAST.filter(
      (subjectId) => !request.data.selectedSubjectIds.includes(subjectId),
    );

  const updateSubjectStatus = changeMultipleSubjectsStatusAtOnce(
    subjectIDsNotSelectedForNextTOAST,
    SubjectStatus.AVAILABLE,
  );

  return Promise.all([updateCurrentToast, updateSubjectStatus.commit()]);
});
