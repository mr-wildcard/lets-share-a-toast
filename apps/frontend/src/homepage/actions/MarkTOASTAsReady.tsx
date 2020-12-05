import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import Image from 'frontend/core/components/Image';

interface Props {
  onClick: () => void;
}

const MarkTOASTAsReady: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <C.Button
      onClick={onClick}
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      colorScheme="blue"
      fontWeight="bold"
    >
      <Image
        position="absolute"
        right="10px"
        bottom="0"
        width={54}
        height={65}
        src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif"
      />

      <C.Text fontWeight="bold" pr="50px">
        Mark TOAST as ready!
      </C.Text>
    </C.Button>
  );
};

export default React.memo(MarkTOASTAsReady);
