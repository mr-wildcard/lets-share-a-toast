import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  Float,
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
import { Avatar, AvatarGroup } from "@web/components/ui/avatar";

interface Props {
  subject: Subject;
  currentToast: Toast;
  votingSession: DatabaseVotingSession;
  onVote(subjectId: string): void;
}

export const VotableSubject: FC<Props> = observer(
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
        <Box padding={4} bg="white">
          <Button
            colorPalette="black"
            variant="link"
            fontWeight="bold"
            fontSize="lg"
            whiteSpace="normal"
            onClick={viewModal.onOpen}
          >
            {subject.title}
          </Button>
        </Box>

        <Box padding={4} bg="white">
          <Box
            position="relative"
            padding={4}
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
              <AvatarGroup gap="20px" flexWrap="wrap">
                {Object.entries(subjectVotes!).map(
                  ([userId, userTotalVotes]) => {
                    const userAvatarURL = userIdAvatarMapping.get(userId);

                    return (
                      <Avatar
                        key={`${userId}-${userTotalVotes}`}
                        src={userAvatarURL}
                      >
                        {userTotalVotes > 1 && (
                          <Float placement="bottom-end" offsetX="1" offsetY="1">
                            {userTotalVotes}
                          </Float>
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

        {viewModal.open && (
          <ViewSubjectModal subject={subject} closeModal={viewModal.onClose} />
        )}
      </Box>
    );
  }
);
