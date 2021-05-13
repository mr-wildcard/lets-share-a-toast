import firebase from "firebase/app";

import {
  DatabaseCurrentTOAST,
  DatabaseRefPaths,
  FirestoreCollection,
  FirestoreSubject,
  FirestoreUser,
} from "@shared/firebase";

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const signin = () => {
  return firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch((error) => {
      console.log({ error });
    });
};

export const signout = (): Promise<void> => {
  return firebase.auth().signOut();
};
