import { when } from "mobx";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

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
    firebase
      .auth()
      .useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST as string);

    firebase
      .firestore()
      .useEmulator(
        import.meta.env.VITE_LOCAL_HOSTNAME as string,
        parseInt(
          import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT as string
        )
      );

    firebase
      .database()
      .useEmulator(
        import.meta.env.VITE_LOCAL_HOSTNAME as string,
        parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_DATABASE_PORT as string)
      );

    firebase
      .functions()
      .useEmulator(
        import.meta.env.VITE_LOCAL_HOSTNAME as string,
        parseInt(
          import.meta.env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT as string
        )
      );
  }
}

const removeAuthListener = firebase.auth().onAuthStateChanged(onAuthChanged);

function onAuthChanged(user: firebase.User | null) {
  if (user) {
    removeAuthListener();

    /**
     * Sequentially load and watch : users, then subjects, then everything else.
     */
    import("./data/users")
      .then(() => when(() => firebaseData.users.length > 0))
      .then(() => import("./data/subjects"))
      .then(() => when(() => firebaseData.subjects.length > 0))
      .then(() =>
        Promise.all([
          import("./data/currentToast"),
          import("./data/votingSession"),
        ])
      );

    firebaseData.connectedUser = user;
  }
}
