import { onValue } from "firebase/database";

import { DatabaseCurrentTOAST } from "@shared/firebase";

import { getFirebaseCurrentToastRef } from "../helpers";
import { firebaseData } from "./";

const currentToastRef = getFirebaseCurrentToastRef();

onValue(currentToastRef, (snapshot) => {
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
      createdDate: new Date(createdDate as string),
      modifiedDate: new Date(modifiedDate as string),
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
