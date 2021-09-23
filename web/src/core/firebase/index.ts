import { when } from "mobx";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";

import { initFirebaseEmulators } from "./emulators";
import { firebaseData } from "./data";

if (!getApps().length) {
  initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  });

  if (import.meta.env.DEV) {
    initFirebaseEmulators();
  }
}

const auth = getAuth();

onAuthStateChanged(auth, (user: FirebaseUser | null) => {
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
});

export const signin = () => {
  if (import.meta.env.DEV) {
    const urlQueryParams = new URLSearchParams(window.location.search);

    if (urlQueryParams.has("userEmail") && urlQueryParams.has("userPassword")) {
      const userEmail = urlQueryParams.get("userEmail");
      const userPassword = urlQueryParams.get("userPassword");

      return signInWithEmailAndPassword(auth, userEmail!, userPassword!);
    }
  }

  return signInWithPopup(auth, new GoogleAuthProvider());
};
