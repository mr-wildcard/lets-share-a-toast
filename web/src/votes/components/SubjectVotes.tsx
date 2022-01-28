import React, { FunctionComponent } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { firebaseData } from "@web/core/firebase/data";
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
        ? 0
        : (100 * subjectTotalVotes) / totalOfAllVotes / 100;

    return (
      <Flex
        position="relative"
        align="end"
        w={`${votableSubjectWidth}px`}
        h="full"
        transformOrigin="center bottom"
        transition="transform 150ms cubic-bezier(0.87, 0, 0.13, 1)"
        background="red"
        style={{
          transform: `scaleY(${verticalBarScaling})`,
        }}
      />
    );
  }
);
