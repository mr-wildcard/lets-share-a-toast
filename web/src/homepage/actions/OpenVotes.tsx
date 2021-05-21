import React, { FunctionComponent } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import Image from "@web/core/components/Image";
import { firebaseData } from "@web/core/firebase/data";
import { SubjectStatus } from "@shared/enums";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const OpenVotes: FunctionComponent<Props> = ({ isSuccess, onClick }) => {
  const availableSubjects = firebaseData.subjects.filter(
    (subject) => subject.status === SubjectStatus.AVAILABLE
  );

  const notEnoughAvailableSubjects = availableSubjects.length <= 1;

  return (
    <>
      {!isSuccess && (
        <Button
          disabled={notEnoughAvailableSubjects}
          onClick={onClick}
          variant="outline"
          position="relative"
          bg="white"
          size="lg"
          colorScheme="blue"
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
            {notEnoughAvailableSubjects
              ? "Not enough subjects to vote for"
              : "Open votes"}
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
          Votes opened
          <CheckCircleIcon ml={3} color="white" boxSize="24px" />
        </Flex>
      )}
    </>
  );
};

export default OpenVotes;
