import React, { FunctionComponent, Suspense } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";
import { useLocation } from "react-router";

import { Pathnames, spacing } from "@web/core/constants";

const Main: FunctionComponent = ({ children }) => {
  const { pathname } = useLocation();

  const isVotingSessionPage = pathname === Pathnames.VOTING_SESSION;

  const styleProps: FlexProps = {
    direction: "column",
    p: `${spacing.stylizedGap}px`,
  };

  if (isVotingSessionPage) {
    styleProps.h = "full";
  } else {
    styleProps.minH = "full";
  }

  return <Flex {...styleProps}>{children}</Flex>;
};

export { Main };
