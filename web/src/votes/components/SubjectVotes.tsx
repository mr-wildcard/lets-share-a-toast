import React, { FunctionComponent } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { firebaseData } from "@web/core/firebase/data";
import { VotableSubject } from "@web/votes/components/VotableSubject";

export const SubjectVotes: FunctionComponent = observer(() => {
  const allAvailableSubjects = firebaseData.availableSubjects;

  return (
    <HStack spacing="2vw" h="full" alignItems="end">
      {allAvailableSubjects.map((subject) => {
        return (
          <Box width="350px" h="50px" bg="blue">
            test
          </Box>
        );
      })}
    </HStack>
  );
});
