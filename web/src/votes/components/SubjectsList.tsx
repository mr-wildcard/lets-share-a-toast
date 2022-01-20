import React, { FunctionComponent } from "react";
import { HStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { firebaseData } from "@web/core/firebase/data";
import { useVote } from "../hooks/useVote";
import { VotableSubject } from "./VotableSubject";

const Component: FunctionComponent = () => {
  const vote = useVote();

  const votingSession = firebaseData.votingSession!;
  const currentToast = firebaseData.currentToast!;
  const allAvailableSubjects = firebaseData.availableSubjects;

  return (
    <HStack h="full" spacing="2vw">
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
    </HStack>
  );
};

export const SubjectsList = React.memo(observer(Component));
