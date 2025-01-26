import React, { FC, PropsWithChildren } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";

import { system } from "@web/core/theme";

const NotificationWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChakraProvider value={system}>
      <Box mt={1} padding={3} borderRadius="3px" boxShadow="sm" bg="white">
        {children}
      </Box>
    </ChakraProvider>
  );
};

export default NotificationWrapper;
