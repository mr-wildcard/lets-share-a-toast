import firebase from "firebase/app";
import { makeObservable, observable } from "mobx";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

import {
  FirestoreUser,
  DatabaseCurrentToast,
  DatabaseRefPaths,
  FirestoreCollection,
} from "@shared/firebase";

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

interface FirebaseInstance extends Record<string, any> {
  connectedUser: FirestoreUser | null;
  currentToast: DatabaseCurrentToast | null;
  users: FirestoreUser[];
}

const firebaseInstance: FirebaseInstance = {
  database: firebase.database(),
  functions: firebase.functions(),
  firestore: firebase.firestore(),
  auth: firebase.auth(),

  connectedUser: null,
  currentToast: null,
  users: [],

  getCurrentUser(auth = firebase.auth()) {
    return auth.currentUser;
  },

  signin(auth = firebase.auth()) {
    return auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error) => {
        console.log({ error });
      });
  },

  signout(auth = firebase.auth()): Promise<void> {
    return auth.signOut();
  },
};

const removeAuthListener = firebase.auth().onAuthStateChanged(onAuthChanged);

function onAuthChanged(user: firebase.User | null) {
  if (user) {
    firebaseInstance.connectedUser = user;

    firebase
      .firestore()
      .collection(FirestoreCollection.USERS)
      .onSnapshot((snapshot) => {
        firebaseInstance.users = snapshot.docs.map(
          (doc) => doc.data() as FirestoreUser
        );
      });

    firebase
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .on("value", (snapshot) => {
        console.log(snapshot.val());

        firebaseInstance.currentToast = snapshot.val();
      });

    removeAuthListener();
  }
}

export default makeObservable(firebaseInstance, {
  connectedUser: observable,
  users: observable,
  currentToast: observable,
});
