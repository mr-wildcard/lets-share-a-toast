import firebase from "firebase/app";
import { FirestoreCollection, FirestoreSubject } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .firestore()
  .collection(FirestoreCollection.SUBJECTS)
  .onSnapshot((snapshot) => {
    const subjects = snapshot.docs.map((doc) => {
      const subject = doc.data() as FirestoreSubject;

      return {
        ...subject,
        id: doc.id,
        speakers: subject.speakersIds.map(
          (speakerId) =>
            firebaseData.users.find((user) => user.id === speakerId)!
        ),
      };
    });

    firebaseData.subjects = subjects;

    if (import.meta.env.DEV) {
      console.log({ subjects });
    }
  });
