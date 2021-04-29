import firebase from "firebase/app";
import { computed, makeObservable, observable } from "mobx";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

import {
  FirestoreUser,
  FirestoreSubject,
  DatabaseCurrentToast,
  DatabaseRefPaths,
  FirestoreCollection,
} from "@shared/firebase";
import { Subject, User } from "@shared/models";

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
  users: User[];
  subjects: Subject[];
}

const firebaseInstance: FirebaseInstance = {
  database: firebase.database(),
  functions: firebase.functions(),
  firestore: firebase.firestore(),
  auth: firebase.auth(),

  connectedUser: null,
  currentToast: null,
  users: [],
  subjects: [],

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
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as FirestoreUser),
        }));

        firebaseInstance.users = users;

        if (import.meta.env.DEV) {
          console.log({ users });
        }
      });

    firebase
      .firestore()
      .collection(FirestoreCollection.SUBJECTS)
      .onSnapshot((snapshot) => {
        const subjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as FirestoreSubject),
        }));

        firebaseInstance.subjects = subjects;

        if (import.meta.env.DEV) {
          console.log({ subjects });
        }
      });

    firebase
      .database()
      .ref(DatabaseRefPaths.CURRENT_TOAST)
      .on("value", (snapshot) => {
        const currentToast = snapshot.val();

        firebaseInstance.currentToast = currentToast;

        if (import.meta.env.DEV) {
          console.log({ currentToast });
        }
      });

    removeAuthListener();
  }
}

export default makeObservable(firebaseInstance, {
  connectedUser: observable,
  currentToast: observable,
  users: observable,
  subjects: observable,
});
