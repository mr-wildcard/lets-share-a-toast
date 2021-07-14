import firebase from "firebase/app";
import { FirestoreCollection, FirestoreSubject } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .firestore()
  .collection(FirestoreCollection.SUBJECTS)
  .onSnapshot((snapshot) => {
    if (snapshot.metadata.hasPendingWrites) {
      /**
       * As we use FieldValue.serverTimestamp() for subjects `lastModifiedDate`,
       * the value of this field is returned as `null` in a first snapshot,
       * then, once resolved on backend side, returned as its true value in a second snapshot.
       * Therefore we need to wait for the snapshot to finish its pending writes.
       * https://github.com/firebase/firebase-js-sdk/issues/1929#issuecomment-506982593
       */
      return;
    }

    if (import.meta.env.DEV || window._log_firebase) {
      console.log({
        subjects: snapshot.docs.map((doc) => doc.data()),
      });
    }

    firebaseData.subjects = snapshot.docs.map((doc) => {
      const subject = doc.data() as FirestoreSubject;

      const { createdDate, lastModifiedDate } = subject;

      return {
        ...subject,
        id: doc.id,
        createdDate: new firebase.firestore.Timestamp(
          createdDate.seconds,
          createdDate.nanoseconds
        ).toDate(),
        createdByUser: firebaseData.users.find(
          (user) => user.id === subject.createdByUserId
        )!,
        lastModifiedDate: new firebase.firestore.Timestamp(
          lastModifiedDate.seconds,
          lastModifiedDate.nanoseconds
        ).toDate(),
        lastModifiedByUser: firebaseData.users.find(
          (user) => user.id === subject.lastModifiedByUserId
        )!,
        speakers: subject.speakersIds.map(
          (speakerId) =>
            firebaseData.users.find((user) => user.id === speakerId)!
        ),
      };
    });

    firebaseData.subjectsLoaded = true;
  });
