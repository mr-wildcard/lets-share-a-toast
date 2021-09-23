import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { Box, Button, SimpleGrid, Divider, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";
import { Toast } from "@shared/models";
import { getSelectedSubjectIds, getSubjectTotalVotes } from "@shared/utils";

import { firebaseData } from "@web/core/firebase/data";
import { getFirebaseVotingSessionRef } from "@web/core/firebase/helpers";

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
    const votingSessionRef = getFirebaseVotingSessionRef();

    const firebaseVotingSessionListener = onValue(
      votingSessionRef,
      (snapshot) => {
        setVotingSession(snapshot.val() as DatabaseVotingSession);
      }
    );

    return () => {
      firebaseVotingSessionListener();
    };
  }, []);

  const selectedSubjects = useMemo(() => {
    if (!votingSession?.votes) {
      return [];
    }

    const selectedSubjectIds = getSelectedSubjectIds(
      votingSession.votes,
      currentToast.maxSelectableSubjects
    );

    return selectedSubjectIds.map((subjectId) => {
      return firebaseData.subjects.find((subject) => subject.id === subjectId)!;
    });
  }, [votingSession?.votes, currentToast.maxSelectableSubjects]);

  const vote = useCallback((subjectId) => {
    const database = getDatabase();
    const userSubjectVoteRef = ref(
      database,
      `${DatabaseRefPaths.VOTING_SESSION}/votes/${subjectId}/${
        firebaseData.connectedUser!.uid
      }`
    );

    return runTransaction(
      userSubjectVoteRef,
      (userTotalVotes: null | number) => {
        if (userTotalVotes) {
          if (userTotalVotes >= 3) {
            return null;
          } else {
            return userTotalVotes + 1;
          }
        } else {
          return 1;
        }
      }
    );
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
              {selectedSubjects.map((subject) => {
                return <li key={subject.id}>{subject.title}</li>;
              })}
            </ul>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
});

export { Subjects };
