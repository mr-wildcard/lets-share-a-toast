import { when } from "mobx";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

import { useFirebaseEmulators } from "./emulators";
import { firebaseData } from "./data";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  });

  if (import.meta.env.DEV) {
    useFirebaseEmulators();
  }
}

function onAuthChanged(user: firebase.User | null) {
  firebaseData.connectedUser = user;

  if (user) {
    /**
     * Sequentially load and watch :
     * 1. users
     * 2. subjects
     * 3. current toast and voting session
     */
    import("./data/users")
      .then(() => when(() => firebaseData.usersLoaded))
      .then(() => import("./data/subjects"))
      .then(() => when(() => firebaseData.subjectsLoaded))
      .then(() =>
        Promise.all([
          import("./data/currentToast"),
          import("./data/votingSession"),
        ])
      )
      .catch((error) => {
        console.error("An error occured while loading Firebase data:", {
          error,
        });
      });
  }
}

firebase.auth().onAuthStateChanged(onAuthChanged);

export const signin = () => {
  return firebase
    .auth()
    .signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

export const signout = (): Promise<void> => {
  return firebase.auth().signOut();
};
