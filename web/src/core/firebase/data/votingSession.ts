import firebase from "firebase/app";

import { DatabaseRefPaths } from "@shared/firebase";

import { firebaseData } from "./";

firebase
  .database()
  .ref(DatabaseRefPaths.VOTING_SESSION)
  .on("value", (snapshot) => {
    const votingSession = snapshot.val();

    firebaseData.votingSession = votingSession;

    if (import.meta.env.DEV) {
      console.log({ votingSession });
    }
  });
