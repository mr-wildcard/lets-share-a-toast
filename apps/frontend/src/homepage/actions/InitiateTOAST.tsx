import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

import Image from 'frontend/core/components/Image';

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const InitiateTOAST: FunctionComponent<Props> = ({ isSuccess, onClick }) => {
  return !isSuccess ? (
    <C.Button
      onClick={onClick}
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      fontSize="xl"
      colorScheme="blue"
    >
      <C.Text fontWeight="bold" pr="50px">
        Start a TOAST!
      </C.Text>
      <Image
        position="absolute"
        width={60}
        height={72}
        right="5px"
        src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp"
      />
    </C.Button>
  ) : (
    <C.Flex
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
    </C.Flex>
  );
};

export default React.memo(InitiateTOAST);
