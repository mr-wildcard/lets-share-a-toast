import firebase from "firebase/app";

export function useFirebaseEmulators() {
  firebase.auth().useEmulator(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST);

  firebase
    .firestore()
    .useEmulator(
      import.meta.env.VITE_LOCAL_HOSTNAME,
      parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT)
    );

  firebase
    .database()
    .useEmulator(
      import.meta.env.VITE_LOCAL_HOSTNAME,
      parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_DATABASE_PORT)
    );

  firebase
    .functions()
    .useEmulator(
      import.meta.env.VITE_LOCAL_HOSTNAME,
      parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT)
    );
}
