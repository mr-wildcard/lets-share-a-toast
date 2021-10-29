import React from "react";
import { observer } from "mobx-react-lite";

import { useClientSideVotingSession } from "../stores/ClientSideVotingSession";
import { Heading, Text } from "@chakra-ui/react";

const UserVotesLeft = observer(() => {
  const { currentUserRemainingVotes } = useClientSideVotingSession();

  return <Heading as="h2">{currentUserRemainingVotes}</Heading>;
});

export { UserVotesLeft };
