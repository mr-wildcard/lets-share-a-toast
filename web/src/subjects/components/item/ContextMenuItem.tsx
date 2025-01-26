import React, { FC, PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";
import { MenuItem } from "react-contextmenu";

interface Props {
  onClick: () => void;
}

const ContextMenuItem: FC<PropsWithChildren<Props>> = ({
  onClick,
  children,
}) => {
  return (
    <MenuItem onClick={onClick}>
      <Flex
        align="center"
        cursor="pointer"
        _hover={{
          bg: "gray.100",
        }}
        padding={2}
        px={3}
      >
        {children}
      </Flex>
    </MenuItem>
  );
};

export default ContextMenuItem;
