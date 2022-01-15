import React, { FunctionComponent, Suspense } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { useLocation } from "react-router";

import { Pathnames, spacing } from "@web/core/constants";

const Main: FunctionComponent = ({ children }) => {
  return (
    <Flex direction="column" minH="full" p={`${spacing.stylizedGap}px`}>
      {children}
    </Flex>
  );
};

export { Main };
