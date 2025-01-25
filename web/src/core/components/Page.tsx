import React, { FC } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export const Page: FC<BoxProps> = ({ children, ...restOfProps }) => {
  return (
    <Box as="main" zIndex={1} {...restOfProps}>
      {children}
    </Box>
  );
};
