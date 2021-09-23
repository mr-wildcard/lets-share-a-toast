import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { Subject, Toast } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { getSubjectTotalVotes } from "@shared/utils";

interface Props {
  subject: Subject;
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
  onVote(subjectId: string): void;
}

const VotableSubject: FunctionComponent<Props> = ({
  subject,
  currentToast,
  votingSession,
  onVote,
}) => {
  const [voting, setVoting] = useState(false);

  const totalVotes = useMemo(() => {
    const votedSubject = votingSession.votes?.[subject.id];

    return votedSubject ? getSubjectTotalVotes(votedSubject) : 0;
  }, [votingSession.votes?.[subject.id]]);

  const vote = useCallback(async () => {
    if (!voting || currentToast.peopleCanVote) {
      setVoting(true);

      await onVote(subject.id);

      setVoting(false);
    }
  }, [onVote]);

  return (
    <Flex
      as="button"
      key={subject.id}
      borderRadius="8px"
      bgColor="gray.50"
      borderWidth="3px"
      borderStyle="solid"
      borderColor="gray.300"
      onClick={vote}
      disabled={!currentToast.peopleCanVote}
      className="vote-button"
    >
      <Text as="span">
        <Text as="span">{subject.title}</Text>
        <Text my={3} d="block" as="span" fontStyle="italic">
          (votes:&nbsp;
          {totalVotes})
        </Text>
      </Text>
    </Flex>
  );
};

export { VotableSubject };
