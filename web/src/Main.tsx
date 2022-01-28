import React, { FunctionComponent } from "react";
import { Flex } from "@chakra-ui/react";

import { spacing } from "@web/core/constants";

export const Main: FunctionComponent = ({ children }) => {
  return (
    <Flex direction="column" minH="full" p={`${spacing.stylizedGap}px`}>
      {children}
    </Flex>
  );
};
