import React from "react";
import { observer } from "mobx-react-lite";

import { useClientSideVotingSession } from "../stores/ClientSideVotingSession";
import { Text } from "@chakra-ui/react";

const UserVotesLeft = observer(() => {
  const { currentUserRemainingVotes } = useClientSideVotingSession();

  const voteWord = currentUserRemainingVotes > 1 ? "votes" : "vote";

  return (
    <Text
      d="inline-block"
      bg="white"
      fontSize="xl"
      fontWeight="bold"
      borderRadius="sm"
      p={4}
    >
      You have {currentUserRemainingVotes} {voteWord} left.
    </Text>
  );
});

export { UserVotesLeft };
