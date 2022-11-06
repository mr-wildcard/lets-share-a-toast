import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

export function initFirebaseEmulators() {
  console.log(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST);
  connectAuthEmulator(
    getAuth(),
    import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_HOST
  );

  connectFirestoreEmulator(
    getFirestore(),
    import.meta.env.VITE_LOCAL_HOSTNAME,
    parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT)
  );

  connectDatabaseEmulator(
    getDatabase(),
    import.meta.env.VITE_LOCAL_HOSTNAME,
    parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_DATABASE_PORT)
  );

  connectFunctionsEmulator(
    getFunctions(),
    import.meta.env.VITE_LOCAL_HOSTNAME,
    parseInt(import.meta.env.VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT)
  );
}
