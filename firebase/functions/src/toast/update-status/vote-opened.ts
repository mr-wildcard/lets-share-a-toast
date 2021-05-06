import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { SubjectStatus } from "@shared/enums";
import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";

export default async function voteOpened() {
  /**
   * Find all subjects with "Available" status
   */
  const availableSubjectsQuery = await admin
    .firestore()
    .collection("subjects")
    .where("status", "==", SubjectStatus.AVAILABLE)
    .get();

  if (availableSubjectsQuery.empty) {
    throw new Error("No available subjects found to open voting session");
  }

  functions.logger.info(
    availableSubjectsQuery.size + " subjects found to open voting session."
  );

  /**
   * Create a voting session object ready to be stored in
   * realtime database.
   */
  const votingSession: DatabaseVotingSession = {
    peopleCanVote: true,
    votes: {},
  };

  availableSubjectsQuery.forEach((subjectDocument) => {
    votingSession.votes[subjectDocument.id] = {};
  });

  /**
   * Persist voting session object into realtime database.
   */
  return admin
    .database()
    .ref(DatabaseRefPaths.VOTING_SESSION)
    .set(votingSession);
}
