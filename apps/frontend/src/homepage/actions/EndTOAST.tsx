import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { ToastStatus, Toast } from '@letsshareatoast/shared';

import Image from 'frontend/core/components/Image';

interface Props {
  currentToast: Toast;
  onClick: () => void;
}

const EndTOAST: FunctionComponent<Props> = ({ currentToast, onClick }) => {
  const isDisabled = currentToast.status !== ToastStatus.WAITING_FOR_TOAST;

  return (
    <C.Button
      onClick={onClick}
      isDisabled={isDisabled}
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      colorScheme="blue"
    >
      <Image
        position="absolute"
        left="-8px"
        bottom="-10px"
        width={80}
        height={80}
        src="https://media.giphy.com/media/RLVLZDCYkjrdwlUQSt/giphy.webp"
      />

      <C.Text fontWeight="bold" pl={45}>
        End TOAST
      </C.Text>
    </C.Button>
  );
};

export default React.memo(EndTOAST);
