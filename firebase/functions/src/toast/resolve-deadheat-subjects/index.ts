import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { DatabaseRefPaths, FirestoreCollection } from "@shared/firebase";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import { changeMultipleSubjectsStatusAtOnce } from "@firebase-functions/helpers/changeMultipleSubjectsStatusAtOnce";

export const resolveDeadheatSubjects = functions.https.onCall(async (data) => {
  const updateCurrentToast = admin
    .database()
    .ref(DatabaseRefPaths.CURRENT_TOAST)
    .update({
      selectedSubjectIds: data.selectedSubjectIds,
      status: ToastStatus.WAITING_FOR_TOAST,
    });

  /**
   * Selected subjects are selected after closing the votes.
   * But after resolving dead heat subjects votes, some ends up not being selected
   * for the next TOAST anymore.
   */
  const subjectsWithSelectedForNextTOASTStatusQuery = await admin
    .firestore()
    .collection(FirestoreCollection.SUBJECTS)
    .where("status", "==", SubjectStatus.SELECTED_FOR_NEXT_TOAST)
    .get();

  const subjectsIDsWithStatusSelectedForNextTOAST =
    subjectsWithSelectedForNextTOASTStatusQuery.docs.map((doc) => doc.id);

  const subjectIDsNotSelectedForNextTOAST =
    subjectsIDsWithStatusSelectedForNextTOAST.filter(
      (subjectId) => !data.selectedSubjectIds.includes(subjectId)
    );

  const updateSubjectStatus = changeMultipleSubjectsStatusAtOnce(
    subjectIDsNotSelectedForNextTOAST,
    SubjectStatus.AVAILABLE
  );

  return Promise.all([updateCurrentToast, updateSubjectStatus.commit()]);
});
