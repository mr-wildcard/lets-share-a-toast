import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { FirestoreCollection } from "@shared/firebase/firestore/enum/FirestoreCollection";

export const storeIntoFirestoreOnCreation = functions.auth
  .user()
  .onCreate((user: functions.auth.UserRecord) => {
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
        avatarURL: user.photoURL,
        uid: user.uid,
      });
  });
