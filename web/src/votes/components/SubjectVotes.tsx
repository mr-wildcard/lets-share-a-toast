import React, { FunctionComponent } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { votableSubjectWidth } from "../constants";
import { useClientSideVotingSession } from "@web/votes/stores/ClientSideVotingSession";

interface Props {
  subjectId: string;
}

export const SubjectVotes: FunctionComponent<Props> = observer(
  ({ subjectId }) => {
    const { getSubjectTotalVotes, totalOfAllVotes } =
      useClientSideVotingSession();

    const subjectTotalVotes = getSubjectTotalVotes(subjectId);

    const verticalBarScaling =
      subjectTotalVotes === 0
        ? 100
        : 100 - (subjectTotalVotes / totalOfAllVotes) * 100;

    return (
      <Flex w={`${votableSubjectWidth}px`} h="full" overflowY="hidden">
        <Box
          w="full"
          h="full"
          transition="transform 300ms cubic-bezier(0.87, 0, 0.13, 1)"
          background="teal.700"
          borderTopRadius={4}
          style={{
            transform: `translateY(${verticalBarScaling}%)`,
          }}
        />
      </Flex>
    );
  }
);
