import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react-lite";
import { computed } from "mobx";

import { votingSessionHasAtLeastOneVote } from "@shared/utils";

import Image from "@web/core/components/Image";
import firebase from "@web/core/firebase";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const CloseVotes: FunctionComponent<Props> = ({ isSuccess, onClick }) => {
  const isDisabled = computed(
    () => !votingSessionHasAtLeastOneVote(firebase.votingSession!)
  ).get();

  return (
    <>
      {!isSuccess && (
        <C.Button
          onClick={onClick}
          disabled={isDisabled}
          variant="outline"
          position="relative"
          bg="white"
          size="lg"
          colorScheme="blue"
          fontWeight="bold"
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

          <C.Text fontWeight="bold" pr="50px">
            Close votes
          </C.Text>
        </C.Button>
      )}

      {isSuccess && (
        <C.Flex
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
        </C.Flex>
      )}
    </>
  );
};

export default observer(CloseVotes);
