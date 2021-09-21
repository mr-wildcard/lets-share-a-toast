import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { DatabaseRefPaths, SubjectsVotes } from "@shared/firebase";
import { getSelectedSubjectIds } from "@shared/utils";

let maxSelectableSubjects = 0;

admin
  .database()
  .ref(`${DatabaseRefPaths.CURRENT_TOAST}/maxSelectableSubjects`)
  .on("value", (value) => {
    maxSelectableSubjects = value.val();
  });

export const onVoteSubmitted = functions.database
  .ref(`${DatabaseRefPaths.VOTING_SESSION}/votes`)
  .onUpdate((change) => {
    if (!change.after.exists()) {
      return;
    }

    const votes = change.after.val() as SubjectsVotes;

    const selectedSubjectIds = getSelectedSubjectIds(
      votes,
      maxSelectableSubjects
    );

    return admin
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .child("selectedSubjectIds")
      .set(selectedSubjectIds);
  });
