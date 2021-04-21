// @ts-nocheck
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";

export const init = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }

  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const db = firebase.database();

  if (import.meta.env.DEV) {
    auth.useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST);

    firestore.useEmulator(
      import.meta.env.VITE_LOCAL_HOSTNAME,
      parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT)
    );

    db.useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_DATABASE_HOST);
  }

  return {
    database: firestore,

    signin() {
      return auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;

          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;

          console.log({ user });
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log({ error });
        });
    },
    signout(auth: firebase.auth.Auth): Promise<void> {
      return auth.signOut();
    },
  };
};
