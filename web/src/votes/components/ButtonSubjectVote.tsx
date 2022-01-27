import React, { FunctionComponent, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { Button, Text } from "@chakra-ui/react";

import { useClientSideVotingSession } from "@web/votes/stores/ClientSideVotingSession";

interface Props {
  voting: boolean;
  subjectId: string;
  vote(): void;
}

enum TextContentState {
  VOTE,
  REMOVE_VOTE,
  NO_ACTION,
}

const TextContent: FunctionComponent<{ show: boolean }> = ({
  show,
  children,
}) => {
  return (
    <Text
      as="span"
      position="absolute"
      left="50%"
      top="50%"
      transform="translate(-50%, -50%)"
      transition="opacity 100ms"
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      {children}
    </Text>
  );
};

export const ButtonSubjectVote: FunctionComponent<Props> = observer(
  ({ vote, voting, subjectId }) => {
    const { currentUserRemainingVotes, getUserTotalVotesForSubjectId } =
      useClientSideVotingSession();

    const userTotalVotesForThisSubject =
      getUserTotalVotesForSubjectId(subjectId);

    const textContentState = useMemo<TextContentState>(() => {
      if (userTotalVotesForThisSubject > 0) {
        if (currentUserRemainingVotes === 0) {
          return TextContentState.REMOVE_VOTE;
        } else {
          return TextContentState.VOTE;
        }
      } else {
        return TextContentState.NO_ACTION;
      }
    }, [currentUserRemainingVotes, userTotalVotesForThisSubject]);

    const bgColor =
      textContentState === TextContentState.VOTE
        ? "green"
        : textContentState === TextContentState.REMOVE_VOTE
        ? "red"
        : "blue";

    const isDisabled =
      voting || textContentState === TextContentState.NO_ACTION;

    return (
      <Button
        w="full"
        onClick={vote}
        disabled={isDisabled}
        colorScheme={bgColor}
        position="relative"
        flex="auto"
        borderTopRadius="0"
      >
        <TextContent show={textContentState === TextContentState.VOTE}>
          Vote!
        </TextContent>
        <TextContent show={textContentState === TextContentState.REMOVE_VOTE}>
          {"Remote my vote" + (userTotalVotesForThisSubject > 1 ? "s" : "")}
        </TextContent>
        <TextContent show={textContentState === TextContentState.NO_ACTION}>
          Not enough remaining vote...
        </TextContent>
      </Button>
    );
  }
);
