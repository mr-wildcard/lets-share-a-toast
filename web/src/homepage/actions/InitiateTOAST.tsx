import React, { FC } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { LuCircleCheck } from "react-icons/lu";

import Image from "@web/core/components/Image";

interface Props {
  isSuccess: boolean;
  onClick: () => void;
}

const InitiateTOAST: FC<Props> = ({ isSuccess, onClick }) => {
  if (!isSuccess) {
    return (
      <Button
        onClick={onClick}
        variant="solid"
        position="relative"
        colorPalette="blue"
        paddingLeft="75px"
      >
        Start a TOAST!
        <Image
          position="absolute"
          width={60}
          height={72}
          left="10px"
          src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp"
        />
      </Button>
    );
  } else {
    return (
      <Button disabled variant="solid" height="100%" colorPalette="green">
        TOAST Initiated <LuCircleCheck />
      </Button>
    );
  }
};

export default React.memo(InitiateTOAST);
