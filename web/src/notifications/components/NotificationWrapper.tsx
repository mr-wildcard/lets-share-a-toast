import React, { FunctionComponent } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";

import customTheme from "@web/core/theme";

const NotificationWrapper: FunctionComponent = ({ children }) => {
  return (
    <ChakraProvider theme={customTheme}>
      <Box mt={1} p={3} borderRadius="3px" boxShadow="sm" bg="white">
        {children}
      </Box>
    </ChakraProvider>
  );
};

export default NotificationWrapper;
