import React, { FC } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";

import Image from "@web/core/components/Image";
import { firebaseData } from "@web/core/firebase/data";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const OpenVotes: FC<Props> = ({ isSuccess, onClick }) => {
  const { availableSubjects } = firebaseData;

  const notEnoughAvailableSubjects = availableSubjects.length <= 1;

  if (isSuccess) {
    return (
      <Button
        disabled={notEnoughAvailableSubjects}
        variant="outline"
        position="relative"
        bg="white"
        colorPalette="blue"
        onClick={onClick}
        title={
          notEnoughAvailableSubjects
            ? "There is not enough available subjects to open the voting session."
            : "Open voting session."
        }
      >
        <Image
          position="absolute"
          right={0}
          width={60}
          height={60}
          src="https://media.giphy.com/media/QLREiT3pNpO2VPbGjj/giphy.gif"
          transform="rotate(-10deg)"
        />

        <Text fontWeight="bold" pr="40px">
          Open votes
        </Text>
      </Button>
    );
  } else {
    return (
      <Button disabled variant="solid" height="100%" colorPalette="green">
        Votes opened
        <LuCircleCheck color="white" />
      </Button>
    );
  }
};

export default OpenVotes;
