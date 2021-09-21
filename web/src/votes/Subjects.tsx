import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import firebase from "firebase/app";
import { Box, Button, SimpleGrid, Divider, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";
import { Toast } from "@shared/models";
import { getSubjectTotalVotes } from "@shared/utils";

import { firebaseData } from "@web/core/firebase/data";

interface Props {
  currentToast: Toast;
}

const Subjects: FunctionComponent<Props> = observer(({ currentToast }) => {
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
    firebase
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
      <Box>
        <SimpleGrid columns={3} spacing={4}>
          {allAvailableSubjects.map((subject) => {
            const votedSubject = votingSession?.votes?.[subject.id];

            const subjectTotalVotes = votedSubject
              ? getSubjectTotalVotes(votedSubject)
              : 0;

            return (
              <Button
                key={subject.id}
                m={3}
                h="full"
                whiteSpace="normal"
                onClick={() => {
                  if (currentToast.peopleCanVote) {
                    vote(subject.id);
                  }
                }}
                disabled={!currentToast.peopleCanVote}
                className="vote-button"
              >
                <Text as="span">
                  <Text as="span">{subject.title}</Text>
                  <Text my={3} d="block" as="span" fontStyle="italic">
                    (votes:&nbsp;
                    {subjectTotalVotes})
                  </Text>
                </Text>
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
          <Box>
            <ul>
              {currentToast.selectedSubjects!.map((subject, index) => (
                <li key={index}>{subject.title}</li>
              ))}
            </ul>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
});

export { Subjects };
