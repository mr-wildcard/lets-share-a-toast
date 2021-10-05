import React, { FunctionComponent, useCallback, useMemo } from "react";
import { getDatabase, ref, runTransaction, set } from "firebase/database";
import { Box, List, ListItem } from "@chakra-ui/react";
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
      <List
        my={10}
        spacing={5}
        d="flex"
        flexDirection="column"
        alignItems="end"
      >
        {allAvailableSubjects.map((subject) => {
          return (
            <ListItem key={subject.id}>
              <VotableSubject
                subject={subject}
                currentToast={currentToast}
                votingSession={votingSession}
                onVote={vote}
              />
            </ListItem>
          );
        })}
      </List>
    );
  }
);

export { SubjectsList };
