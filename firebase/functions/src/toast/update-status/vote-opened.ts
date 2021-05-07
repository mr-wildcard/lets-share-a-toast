import * as admin from "firebase-admin";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";

export default async function voteOpened() {
  /**
   * Create a voting session object ready to be stored in
   * realtime database.
   */
  const votingSession: DatabaseVotingSession = {
    peopleCanVote: true,
    votes: {},
  };

  /**
   * Persist voting session object into realtime database.
   */
  return admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .set(votingSession);
}
