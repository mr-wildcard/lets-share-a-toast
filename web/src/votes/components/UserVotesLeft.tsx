import React from "react";
import { observer } from "mobx-react-lite";

import { useClientSideVotingSession } from "../stores/ClientSideVotingSession";
import { Heading, Text } from "@chakra-ui/react";

const UserVotesLeft = observer(() => {
  const { currentUserRemainingVotes } = useClientSideVotingSession();

  const voteWord = currentUserRemainingVotes > 1 ? "votes" : "vote";

  return (
    <Heading as="h2">
      You have {currentUserRemainingVotes} {voteWord} left
    </Heading>
  );
});

export { UserVotesLeft };
