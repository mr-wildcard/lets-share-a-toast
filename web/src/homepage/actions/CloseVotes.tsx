import React, { FunctionComponent } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import { votingSessionHasAtLeastOneVote } from "@shared/utils";

import Image from "@web/core/components/Image";
import { firebaseData } from "@web/core/firebase/data";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const CloseVotes: FunctionComponent<Props> = ({ isSuccess, onClick }) => {
  const { votingSession } = firebaseData;

  const notEnoughVotes =
    !votingSession || !votingSessionHasAtLeastOneVote(votingSession);

  return (
    <>
      {!isSuccess && (
        <Button
          onClick={onClick}
          disabled={notEnoughVotes}
          variant="outline"
          position="relative"
          bg="white"
          size="lg"
          colorScheme="blue"
          fontWeight="bold"
          title={
            notEnoughVotes
              ? "Nobody voted for any subject yet."
              : "Close voting session."
          }
        >
          <Image
            src="https://media.giphy.com/media/8YTmbulkH7wWNRnURI/giphy.gif"
            position="absolute"
            width={80}
            height={80}
            top="-20px"
            right="-5px"
            transform="scaleX(-1) rotate(5deg)"
          />

          <Text fontWeight="bold" pr="50px">
            Close votes
          </Text>
        </Button>
      )}

      {isSuccess && (
        <Flex
          h="100%"
          align="center"
          fontWeight="bold"
          color="white"
          bg="green.400"
          px={4}
          borderRadius={3}
        >
          Votes closed
          <CheckCircleIcon ml={3} color="white" boxSize="24px" />
        </Flex>
      )}
    </>
  );
};

export default CloseVotes;
