import React, { FunctionComponent } from "react";
import { Flex, useTheme } from "@chakra-ui/react";
import { MenuItem } from "react-contextmenu";

interface Props {
  onClick: () => void;
}

const ContextMenuItem: FunctionComponent<Props> = ({ onClick, children }) => {
  const theme = useTheme();

  return (
    <MenuItem onClick={onClick}>
      <Flex
        align="center"
        cursor="pointer"
        _hover={{
          bg: theme.colors.gray["100"],
        }}
        p={2}
        px={3}
      >
        {children}
      </Flex>
    </MenuItem>
  );
};

export default ContextMenuItem;
