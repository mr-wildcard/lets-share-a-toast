// @ts-nocheck
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import { makeObservable, observable } from "mobx";

import {
  FirestoreUser,
  DatabaseCurrentToast,
  DatabaseRefPaths,
} from "@shared/firebase";

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

const firebaseInstance = {
  database: firebase.database(),
  functions: firebase.functions(),
  firestore: firebase.firestore(),
  auth: firebase.auth(),

  users: [],
  currentToast: null,

  getCurrentUser(auth = this.auth) {
    return firebase.auth().currentUser;
  },

  signin(auth = this.auth) {
    return auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        return result.user!;
      })
      .catch((error) => {
        console.log({ error });
      });
  },

  signout(auth = this.auth): Promise<void> {
    return auth.signOut();
  },
};

const authHandler = firebase.auth().onAuthStateChanged(onAuthChanged);

function onAuthChanged(user) {
  if (user) {
    firebase
      .firestore()
      .collection("users")
      .onSnapshot(
        (snapshot: firebase.firestore.QuerySnapshot<FirestoreUser>) => {
          firebaseInstance.users = snapshot.docs.map((doc) => doc.data());
        }
      );

    firebase
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .on("value", (snapshot) => {
        firebaseInstance.currentToast = snapshot.val();
      });

    authHandler();
  }
}

export default makeObservable(firebaseInstance, {
  users: observable,
  currentToast: observable,
});
