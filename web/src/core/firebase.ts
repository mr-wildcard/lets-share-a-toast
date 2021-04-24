// @ts-nocheck
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });

  if (import.meta.env.DEV) {
    firebase
      .auth()
      .useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST);

    firebase
      .firestore()
      .useEmulator(
        import.meta.env.VITE_LOCAL_HOSTNAME,
        parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT)
      );

    firebase
      .database()
      .useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_DATABASE_HOST);

    firebase
      .functions()
      .useEmulator(
        import.meta.env.VITE_LOCAL_HOSTNAME,
        parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT)
      );
  }
}

export default {
  database: firebase.database(),
  functions: firebase.functions(),
  firestore: firebase.firestore(),

  getCurrentUser(auth = firebase.auth()) {
    return firebase.auth().currentUser;
  },

  signin(auth = firebase.auth()) {
    return auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        return result.user!;
      })
      .catch((error) => {
        console.log({ error });
      });
  },
  signout(auth: firebase.auth.Auth): Promise<void> {
    return auth.signOut();
  },
};
