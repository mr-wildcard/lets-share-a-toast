import React, { FC } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";

import Image from "@web/core/components/Image";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const InitiateTOAST: FC<Props> = ({ isSuccess, onClick }) => {
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
      <Box ml={3} color="white" boxSize="24px">
        <LuCircleCheck />
      </Box>
    </Flex>
  );
};

export default React.memo(InitiateTOAST);
