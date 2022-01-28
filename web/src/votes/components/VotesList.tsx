import React from "react";
import { observer } from "mobx-react-lite";
import { HStack } from "@chakra-ui/react";

import { firebaseData } from "@web/core/firebase/data";
import { SubjectVotes } from "@web/votes/components/SubjectVotes";

export const VotesList = observer(() => {
  const allAvailableSubjects = firebaseData.availableSubjects;

  return (
    <HStack spacing="2vw" h="full" minHeight="200px" alignItems="end">
      {allAvailableSubjects.map((subject, index) => {
        return (
          <SubjectVotes key={`${subject.id}-${index}`} subjectId={subject.id} />
        );
      })}
    </HStack>
  );
});
