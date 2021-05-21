import firebase from "firebase/app";

import { FirestoreCollection, FirestoreUser } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .firestore()
  .collection(FirestoreCollection.USERS)
  .onSnapshot((snapshot) => {
    firebaseData.users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirestoreUser),
    }));

    firebaseData.usersLoaded = true;

    if (import.meta.env.DEV || window._log_firebase) {
      console.log({ users: snapshot.docs.map((doc) => doc.data()) });
    }
  });
