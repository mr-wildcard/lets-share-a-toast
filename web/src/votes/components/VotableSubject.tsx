import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

import { Subject, Toast } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { getSubjectTotalVotes } from "@shared/utils";

import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";

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

  const viewModal = useDisclosure();

  const totalVotes = useMemo(() => {
    const votedSubject = votingSession?.votes?.[subject.id];

    return votedSubject ? getSubjectTotalVotes(votedSubject) : 0;
  }, [votingSession?.votes?.[subject.id]]);

  const vote = useCallback(async () => {
    if (!voting || currentToast.peopleCanVote) {
      setVoting(true);

      await onVote(subject.id);

      setVoting(false);
    }
  }, [onVote]);

  return (
    <Box w="350px" boxShadow="lg">
      <Box p={4} bg="white" borderTopRadius={3}>
        <Text fontWeight="bold" fontSize="xl">
          {subject.title}
        </Text>
      </Box>

      <Box p={4} bg="white">
        <Box
          p={4}
          borderStyle="dashed"
          borderWidth="1px"
          sx={{
            borderColor: totalVotes > 0 ? "gray.600" : "gray.300",
          }}
        >
          {totalVotes === 0 && <Text color="gray.300">No voters yet...</Text>}
        </Box>
      </Box>

      <ButtonGroup w="full" isAttached={true}>
        <Button onClick={viewModal.onOpen} flex={1} borderTopLeftRadius="0">
          <ViewIcon />
        </Button>
        <Button
          onClick={vote}
          colorScheme="blue"
          flex="auto"
          borderTopRightRadius="0"
        >
          Vote!
        </Button>
      </ButtonGroup>

      {viewModal.isOpen && (
        <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
      )}
    </Box>
  );
};

export { VotableSubject };
