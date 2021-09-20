import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { DatabaseRefPaths, SubjectsVotes } from "@shared/firebase";
import { getSelectedSubjectIds } from "@shared/utils";

export const onVoteSubmitted = functions.database
  .ref(`${DatabaseRefPaths.VOTING_SESSION}/votes`)
  .onUpdate((change) => {
    if (!change.after.exists()) {
      return;
    }

    const votes = change.after.val() as SubjectsVotes;

    return admin
      .database()
      .ref(`${DatabaseRefPaths.CURRENT_TOAST}/maxSelectableSubjects`)
      .get()
      .then((value) => value.val())
      .then((maxSelectableSubjects) => {
        const selectedSubjectIds = getSelectedSubjectIds(
          votes,
          maxSelectableSubjects
        );

        return admin
          .database()
          .ref(DatabaseRefPaths.VOTING_SESSION)
          .child("selectedSubjects")
          .set(selectedSubjectIds);
      });
  });
