import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

export const init = () => {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  const auth = firebase.auth();
  const firestore = firebase.firestore();

  if (process.env.NODE_ENV !== 'production') {
    auth.useEmulator(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_AUTH_HOST);

    firestore.useEmulator(
      process.env.NEXT_PUBLIC_LOCAL_HOSTNAME,
      parseInt(process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT)
    );
  }

  return {
    database: firestore,

    signin() {
      return auth.signInAnonymously();
    },
    signout(auth: firebase.auth.Auth): Promise<void> {
      return auth.signOut();
    },
  };
};
