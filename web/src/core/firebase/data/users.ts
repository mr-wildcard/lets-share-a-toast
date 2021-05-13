import firebase from "firebase/app";

import { FirestoreCollection, FirestoreUser } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .firestore()
  .collection(FirestoreCollection.USERS)
  .onSnapshot((snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirestoreUser),
    }));

    firebaseData.users = users;

    if (import.meta.env.DEV) {
      console.log({ users });
    }
  });
