import firebase from "firebase/app";

import { DatabaseCurrentTOAST, DatabaseRefPaths } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .database()
  .ref(DatabaseRefPaths.CURRENT_TOAST)
  .on("value", (snapshot) => {
    const currentToast: DatabaseCurrentTOAST = snapshot.val();

    if (currentToast !== null) {
      const {
        date,
        createdDate,
        modifiedDate,
        selectedSubjectIds = [],
        ...restOfCurrentTOASTProps
      } = currentToast;

      firebaseData.currentToast = {
        ...restOfCurrentTOASTProps,
        date: new Date(date),
        createdDate: new Date(createdDate),
        modifiedDate: new Date(modifiedDate),
        organizer: firebaseData.users.find(
          (user) => user.id === currentToast.organizerId
        )!,
        scribe: firebaseData.users.find(
          (user) => user.id === currentToast.scribeId
        )!,
        selectedSubjects: selectedSubjectIds.map(
          (selectedSubjectId) =>
            firebaseData.subjects.find(
              (subject) => subject.id === selectedSubjectId
            )!
        ),
      };
    } else {
      firebaseData.currentToast = currentToast;
    }

    if (import.meta.env.DEV || window._log_firebase) {
      console.log({ currentToast });
    }
  });
