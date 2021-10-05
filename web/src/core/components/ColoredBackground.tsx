import React, { FunctionComponent } from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ui } from "@web/core/stores/ui";

const ColoredBackground: FunctionComponent<BoxProps> = ({
  children,
  ...restOfBoxProps
}) => {
  return (
    <Box
      as="main"
      style={{
        backgroundColor: ui.currentPageBgColor,
      }}
      borderRadius={3}
      transition="background-color 500ms ease"
      {...restOfBoxProps}
    >
      {children}
    </Box>
  );
};

export default observer(ColoredBackground);
