import React, { FunctionComponent, useMemo } from "react";
import { List, ListItem } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { firebaseData } from "@web/core/firebase/data";
import { useClientSideVotingSession } from "@web/votes/stores/ClientSideVotingSession";
import { useVote } from "../hooks/useVote";
import { VotableSubject } from "./VotableSubject";

const Component: FunctionComponent = () => {
  const { selectedSubjectIds } = useClientSideVotingSession();
  const vote = useVote();

  const votingSession = firebaseData.votingSession!;
  const currentToast = firebaseData.currentToast!;
  const allAvailableSubjects = firebaseData.availableSubjects;

  const selectedSubjects = useMemo(() => {
    return selectedSubjectIds.map((subjectId) => {
      return firebaseData.subjects.find((subject) => subject.id === subjectId)!;
    });
  }, [selectedSubjectIds]);

  return (
    <List spacing={5} d="flex" flexDirection="column" alignItems="center">
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
};

export const SubjectsList = React.memo(observer(Component));
