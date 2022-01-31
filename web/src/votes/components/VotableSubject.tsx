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
  Text,
  useDisclosure,
  useToken,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { Subject, Toast } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { getSubjectTotalVotes } from "@shared/utils";

import ViewSubjectModal from "@web/subjects/components/modals/ViewSubjectModal";
import { useClientSideVotingSession } from "../stores/ClientSideVotingSession";
import { ButtonSubjectVote } from "../components/ButtonSubjectVote";
import { votableSubjectWidth } from "../constants";

interface Props {
  subject: Subject;
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
  onVote(subjectId: string): void;
}

export const VotableSubject: FunctionComponent<Props> = observer(
  ({ subject, currentToast, votingSession, onVote }) => {
    const [gray300, gray600] = useToken("colors", ["gray.300", "gray.600"]);

    const { userIdAvatarMapping, currentUserRemainingVotes } =
      useClientSideVotingSession();

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
      <Box w={`${votableSubjectWidth}px`} boxShadow="lg">
        <Box p={4} bg="white">
          <Button
            colorScheme="black"
            variant="link"
            fontWeight="bold"
            fontSize="lg"
            whiteSpace="normal"
            onClick={viewModal.onOpen}
          >
            {subject.title}
          </Button>
        </Box>

        <Box p={4} bg="white">
          <Box
            position="relative"
            p={4}
            borderStyle="dashed"
            borderWidth="1px"
            style={{
              borderColor: totalVotes > 0 ? gray600 : gray300,
            }}
          >
            {totalVotes === 0 && (
              <>
                <Avatar name="John Doe" visibility="hidden" />
                <Text
                  position="absolute"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.600"
                >
                  No voters yet...
                </Text>
              </>
            )}

            {totalVotes > 0 && (
              <AvatarGroup spacing={0} gap="20px" flexWrap="wrap">
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

        <ButtonSubjectVote vote={vote} voting={voting} subjectId={subject.id} />

        {viewModal.isOpen && (
          <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
        )}
      </Box>
    );
  }
);
