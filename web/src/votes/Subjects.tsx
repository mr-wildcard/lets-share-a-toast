import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import firebase from "firebase/app";
import { Box, Button, SimpleGrid, Divider } from "@chakra-ui/react";

import {
  DatabaseRefPaths,
  DatabaseVotingSession,
  SubjectVote,
} from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";
import { Toast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";

function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);

interface Props {
  currentToast: Toast;
}

const Subjects: FunctionComponent<Props> = ({ currentToast }) => {
  const allAvailableSubjects = firebaseData.subjects.filter(
    (subject) => subject.status === SubjectStatus.AVAILABLE
  );

  const [votingSession, setVotingSession] =
    useState<null | DatabaseVotingSession>(null);

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

  /**
   * --------------------------------------------------
   *
   *
   *
   *
   *
   */
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (votingSession?.votes) {
  }, [votingSession]);

  /**
   *
   *
   *
   *
   *
   * --------------------------------------------------
   */

  return (
    <Box>
      {votingSession !== null && (
        <Box>
          <SimpleGrid columns={3} spacing={4}>
            {allAvailableSubjects.map((subject) => {
              return (
                <Button
                  key={subject.id}
                  m={3}
                  h="full"
                  whiteSpace="normal"
                  onClick={() => vote(subject.id)}
                  disabled={!votingSession.peopleCanVote}
                  className="vote-button"
                >
                  {subject.title} (
                  {votingSession.votes?.[subject.id]
                    ? getSubjectTotalVotes(votingSession.votes[subject.id])
                    : 0}
                  )
                </Button>
              );
            })}
          </SimpleGrid>

          <Divider my={10} borderColor="black" />

          <SimpleGrid columns={3} gap={10}>
            <Box>
              <pre>
                <code>{JSON.stringify(votingSession, null, 3)}</code>
              </pre>
            </Box>
            <Divider borderColor="black" orientation="vertical" h="100%" />
            <Box>
              <pre>
                <code>{JSON.stringify(winners, null, 3)}</code>
              </pre>
            </Box>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export { Subjects };
