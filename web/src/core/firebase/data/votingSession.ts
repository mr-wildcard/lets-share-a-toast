import { onValue } from "firebase/database";

import { getFirebaseVotingSessionRef } from "../helpers";
import { firebaseData } from "./";

const votingSessionRef = getFirebaseVotingSessionRef();

onValue(votingSessionRef, (snapshot) => {
  const votingSession = snapshot.val();

  firebaseData.votingSession = votingSession;

  if (import.meta.env.DEV || window._log_firebase) {
    console.log({ votingSession });
  }
});
