import React, { FC } from "react";
import { Button, Text } from "@chakra-ui/react";

import { Toast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import Image from "@web/core/components/Image";

interface Props {
  currentToast: Toast;
  onClick: () => void;
}

const EndTOAST: FC<Props> = ({ currentToast, onClick }) => {
  const isDisabled = currentToast.status !== ToastStatus.WAITING_FOR_TOAST;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      variant="outline"
      position="relative"
      bg="white"
      colorPalette="blue"
      paddingLeft="60px"
    >
      <Image
        position="absolute"
        left={0}
        bottom="-10px"
        width={65}
        height={65}
        src="https://media.giphy.com/media/RLVLZDCYkjrdwlUQSt/giphy.webp"
      />

      <Text fontWeight="bold">End TOAST</Text>
    </Button>
  );
};

export default React.memo(EndTOAST);
