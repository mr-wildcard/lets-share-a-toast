import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Text,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";

import { Subject, Toast } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { getSubjectTotalVotes } from "@shared/utils";

import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";
import { useClientSideVotingSession } from "../stores/ClientSideVotingSession";

interface Props {
  subject: Subject;
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
  onVote(subjectId: string): void;
}

const VotableSubject: FunctionComponent<Props> = observer(
  ({ subject, currentToast, votingSession, onVote }) => {
    const [gray300, gray600] = useToken("colors", ["gray.300", "gray.600"]);

    const { userIdAvatarMapping } = useClientSideVotingSession();

    const [voting, setVoting] = useState(false);

    const viewModal = useDisclosure();

    const subjectVotes = votingSession?.votes?.[subject.id];

    const totalVotes = useMemo(() => {
      return subjectVotes ? getSubjectTotalVotes(subjectVotes) : 0;
    }, [subjectVotes]);

    const vote = useCallback(async () => {
      if (!voting || currentToast.peopleCanVote) {
        setVoting(true);

        await onVote(subject.id);

        setVoting(false);
      }
    }, [onVote, voting, currentToast.peopleCanVote]);

    return (
      <Box w="350px" boxShadow="lg">
        <Box p={4} bg="white">
          <Text fontWeight="bold" fontSize="2xl">
            {subject.title}
          </Text>
        </Box>

        <Box p={4} bg="white">
          <Box
            position="relative"
            p={4}
            borderStyle="dashed"
            borderWidth="1px"
            style={{
              borderColor: totalVotes > 0 ? "gray.300" : "gray.600",
            }}
          >
            {totalVotes === 0 && (
              <>
                <Avatar name="John Doe" visibility="hidden" />
                <Text
                  position="absolute"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  No voters yet...
                </Text>
              </>
            )}

            {totalVotes > 0 && (
              <AvatarGroup spacing={0} gap="11px" flexWrap="wrap">
                {Object.entries(subjectVotes!).map(
                  ([userId, userTotalVotes]) => {
                    const userAvatarURL = userIdAvatarMapping.get(userId);

                    return (
                      <Avatar
                        key={`${userId}-${userTotalVotes}`}
                        src={userAvatarURL}
                      >
                        {userTotalVotes > 1 && (
                          <AvatarBadge
                            boxSize="1.6em"
                            fontSize="0.8em"
                            bg="blue.500"
                            color="white"
                          >
                            {userTotalVotes}
                          </AvatarBadge>
                        )}
                      </Avatar>
                    );
                  }
                )}
              </AvatarGroup>
            )}
          </Box>
        </Box>

        <ButtonGroup size="lg" w="full" isAttached={true}>
          <Button onClick={viewModal.onOpen} borderTopLeftRadius="0">
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
  }
);

export { VotableSubject };
