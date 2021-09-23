import { getFirestore, collection, onSnapshot } from "firebase/firestore";

import { FirestoreCollection, FirestoreUser } from "@shared/firebase";

import { firebaseData } from "./";

const firestore = getFirestore();
const usersCollection = collection(firestore, FirestoreCollection.USERS);

onSnapshot(usersCollection, (snapshot) => {
  firebaseData.users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as FirestoreUser),
  }));

  firebaseData.usersLoaded = true;

  if (import.meta.env.DEV || window._log_firebase) {
    console.log({ users: snapshot.docs.map((doc) => doc.data()) });
  }
});
