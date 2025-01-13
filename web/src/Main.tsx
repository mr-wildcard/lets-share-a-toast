import React, { FC, PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";

import { spacing } from "@web/core/constants";

export const Main: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Flex direction="column" minH="full" p={`${spacing.stylizedGap}px`}>
      {children}
    </Flex>
  );
};
