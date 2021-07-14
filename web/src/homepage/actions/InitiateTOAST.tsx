import React, { FunctionComponent } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import Image from "@web/core/components/Image";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const InitiateTOAST: FunctionComponent<Props> = ({ isSuccess, onClick }) => {
  return !isSuccess ? (
    <Button
      onClick={onClick}
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      fontSize="xl"
      colorScheme="blue"
    >
      <Text fontWeight="bold" pr="50px">
        Start a TOAST!
      </Text>
      <Image
        position="absolute"
        width={60}
        height={72}
        right="5px"
        src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp"
      />
    </Button>
  ) : (
    <Flex
      h="100%"
      align="center"
      fontWeight="bold"
      color="white"
      bg="green.400"
      px={4}
      borderRadius={3}
    >
      TOAST Initiated
      <CheckCircleIcon ml={3} color="white" boxSize="24px" />
    </Flex>
  );
};

export default React.memo(InitiateTOAST);
