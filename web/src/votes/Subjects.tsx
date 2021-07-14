import React, { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";
import { Box, Button } from "@chakra-ui/react";

import {
  DatabaseRefPaths,
  DatabaseVotingSession,
  SubjectVote,
} from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

import { firebaseData } from "@web/core/firebase/data";

function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);
}

export function Subjects() {
  const allAvailableSubjects = firebaseData.subjects.filter(
    (subject) => subject.status === SubjectStatus.AVAILABLE
  );

  const [
    votingSession,
    setVotingSession,
  ] = useState<null | DatabaseVotingSession>(null);

  useEffect(() => {
    const databaseVotingSessionRef = firebase
      .database()
      .ref(DatabaseRefPaths.VOTING_SESSION);

    const firebaseVotingSessionListener = databaseVotingSessionRef.on(
      "value",
      (snapshot) => {
        setVotingSession(snapshot.val() as DatabaseVotingSession);
      }
    );

    return () => {
      databaseVotingSessionRef.off("value", firebaseVotingSessionListener);
    };
  }, []);

  const vote = useCallback((subjectId) => {
    return firebase
      .database()
      .ref(DatabaseRefPaths.VOTING_SESSION)
      .child("votes")
      .child(subjectId)
      .child(firebaseData.connectedUser!.uid)
      .transaction((userTotalVotes: null | number) => {
        if (userTotalVotes) {
          if (userTotalVotes >= 3) {
            return null;
          } else {
            return userTotalVotes + 1;
          }
        } else {
          return 1;
        }
      });
  }, []);

  return (
    <Box>
      {votingSession !== null && (
        <Box>
          {allAvailableSubjects.map((subject) => {
            return (
              <Button
                key={subject.id}
                m={3}
                onClick={() => vote(subject.id)}
                disabled={!votingSession.peopleCanVote}
                className="vote-button"
              >
                {subject.id} (
                {votingSession.votes?.[subject.id]
                  ? getSubjectTotalVotes(votingSession.votes[subject.id])
                  : 0}
                )
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
