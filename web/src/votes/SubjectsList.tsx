import React, { FunctionComponent, useCallback, useMemo } from "react";
import { getDatabase, ref, runTransaction } from "firebase/database";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { DatabaseRefPaths, DatabaseVotingSession } from "@shared/firebase";
import { Toast } from "@shared/models";
import { getSelectedSubjectIds } from "@shared/utils";

import { firebaseData } from "@web/core/firebase/data";
import { VotableSubject } from "@web/votes/VotableSubject";

interface Props {
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
}

const SubjectsList: FunctionComponent<Props> = observer(
  ({ currentToast, votingSession }) => {
    const allAvailableSubjects = firebaseData.availableSubjects;

    const selectedSubjects = useMemo(() => {
      if (!votingSession?.votes) {
        return [];
      }

      const selectedSubjectIds = getSelectedSubjectIds(
        votingSession.votes,
        currentToast.maxSelectableSubjects
      );

      return selectedSubjectIds.map((subjectId) => {
        return firebaseData.subjects.find(
          (subject) => subject.id === subjectId
        )!;
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
