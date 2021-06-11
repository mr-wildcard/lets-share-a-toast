import firebase from "firebase/app";
import { FirestoreCollection, FirestoreSubject } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .firestore()
  .collection(FirestoreCollection.SUBJECTS)
  .onSnapshot((snapshot) => {
    if (import.meta.env.DEV || window._log_firebase) {
      console.log({
        subjects: snapshot.docs.map((doc) =>
          doc.data({
            serverTimestamps: "estimate",
          })
        ),
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
