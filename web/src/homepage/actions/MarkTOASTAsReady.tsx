import React, { FC } from "react";
import { Button, Text } from "@chakra-ui/react";

import Image from "@web/core/components/Image";

interface Props {
  onClick: () => void;
}

const MarkTOASTAsReady: FC<Props> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      position="relative"
      bg="white"
      colorPalette="blue"
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

      <Text fontWeight="bold" pr="50px">
        Mark TOAST as ready!
      </Text>
    </Button>
  );
};

export default React.memo(MarkTOASTAsReady);
