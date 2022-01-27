import React, { FunctionComponent } from "react";
import { HStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { firebaseData } from "@web/core/firebase/data";
import { useVote } from "../hooks/useVote";
import { VotableSubject } from "./VotableSubject";

export const SubjectsList: FunctionComponent = observer(() => {
  const vote = useVote();

  const votingSession = firebaseData.votingSession!;
  const currentToast = firebaseData.currentToast!;
  const allAvailableSubjects = firebaseData.availableSubjects;

  return (
    <HStack spacing="2vw" alignItems="start">
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
});
