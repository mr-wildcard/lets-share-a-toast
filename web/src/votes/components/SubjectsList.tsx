import React, { FunctionComponent, useCallback, useMemo } from "react";
import { getDatabase, ref, runTransaction, set } from "firebase/database";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { Toast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import { useClientSideVotingSession } from "@web/votes/stores/ClientSideVotingSession";
import { VotableSubject } from "./VotableSubject";

interface Props {
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
}

const SubjectsList: FunctionComponent<Props> = observer(
  ({ currentToast, votingSession }) => {
    const {
      currentUserRemainingVotes,
      currentUserTotalVotes,
      selectedSubjectIds,
    } = useClientSideVotingSession();

    const allAvailableSubjects = firebaseData.availableSubjects;

    const selectedSubjects = useMemo(() => {
      return selectedSubjectIds.map((subjectId) => {
        return firebaseData.subjects.find(
          (subject) => subject.id === subjectId
        )!;
      });
    }, [selectedSubjectIds]);

    const vote = useCallback(
      (subjectId) => {
        const database = getDatabase();
        const userSubjectVoteRef = ref(
          database,
          `${DatabaseRefPaths.VOTING_SESSION}/votes/${subjectId}/${
            firebaseData.connectedUser!.uid
          }`
        );

        if (currentUserRemainingVotes === 0) {
          return set(userSubjectVoteRef, null);
        } else {
          return runTransaction(
            userSubjectVoteRef,
            (userTotalVotes: null | number) => {
              if (userTotalVotes) {
                return userTotalVotes + 1;
              } else {
                return 1;
              }
            }
          );
        }
      },
      [currentUserRemainingVotes]
    );

    return (
      <Box>
        currentUserTotalVotes: {currentUserTotalVotes}
        <br />
        currentUserRemainingVotes: {currentUserRemainingVotes}
        <SimpleGrid columns={3} spacing={4}>
          {allAvailableSubjects.map((subject) => {
            return (
              <VotableSubject
                key={subject.id}
                subject={subject}
                currentToast={currentToast}
                votingSession={votingSession}
                onVote={vote}
              />
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }
);

export { SubjectsList };
