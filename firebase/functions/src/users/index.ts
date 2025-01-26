import * as auth from "firebase-functions/v1/auth";
import * as admin from "firebase-admin";

import { FirestoreCollection } from "@shared/firebase";

export const storeIntoFirestoreOnCreation = auth.user().onCreate((user) => {
  /**
   * Create a User record into Firestore User collection.
   * This record contains a lot less infos than original User object from Auth service.
   */
  return admin
    .firestore()
    .collection(FirestoreCollection.USERS)
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });
});

export const deleteFromFirestoreOnDeletion = auth.user().onDelete((user) => {
  return admin
    .firestore()
    .collection(FirestoreCollection.USERS)
    .doc(user.uid)
    .delete();
});
