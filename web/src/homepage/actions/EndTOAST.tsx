import React, { FunctionComponent } from "react";
import { Button, Text } from "@chakra-ui/react";

import { Toast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import Image from "@web/core/components/Image";

interface Props {
  currentToast: Toast;
  onClick: () => void;
}

const EndTOAST: FunctionComponent<Props> = ({ currentToast, onClick }) => {
  const isDisabled = currentToast.status !== ToastStatus.WAITING_FOR_TOAST;

  return (
    <Button
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

      <Text fontWeight="bold" pl={45}>
        End TOAST
      </Text>
    </Button>
  );
};

export default React.memo(EndTOAST);
