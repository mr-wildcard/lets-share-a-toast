import React, { FC } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";

import { votingSessionHasAtLeastOneVote } from "@shared/utils";

import Image from "@web/core/components/Image";
import { firebaseData } from "@web/core/firebase/data";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const CloseVotes: FC<Props> = ({ isSuccess, onClick }) => {
  const { votingSession } = firebaseData;

  const notEnoughVotes =
    !votingSession || !votingSessionHasAtLeastOneVote(votingSession);

  if (!isSuccess) {
    return (
      <Button
        onClick={onClick}
        disabled={notEnoughVotes}
        variant="outline"
        position="relative"
        bg="white"
        colorPalette="blue"
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
          width={73}
          height={73}
          top="-18px"
          right="-11px"
          transform="scaleX(-1) rotate(5deg)"
        />

        <Text as="span" fontWeight="bold" pr="40px">
          Close votes
        </Text>
      </Button>
    );
  } else {
    return (
      <Button disabled variant="solid" height="100%" colorPalette="green">
        Votes closed
        <LuCircleCheck />
      </Button>
    );
  }
};

export default CloseVotes;
