import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const init = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
};

export const signin = (): Promise<firebase.User> => {
  return new Promise((resolve, reject) => {
    const firebaseAuth = firebase.auth();

    const cleanupListener = firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        cleanupListener();

        resolve(user);
      } else {
        reject(
          "Couldn't signin to Firebase. User object from Firebase is falsy."
        );
      }
    });

    firebaseAuth.signInAnonymously().catch(reject);
  });
};

export const signout = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const firebaseAuth = firebase.auth();

    const cleanupListener = firebaseAuth.onAuthStateChanged(function (user) {
      if (!user) {
        cleanupListener();

        resolve();
      } else {
        reject(
          "Couldn't signout from Firebase. User object from Firebse should be falsy."
        );
      }
    });

    firebaseAuth.signOut().catch(reject);
  });
};

export const getDatabase = () => firebase.firestore();
