import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import customTheme from 'frontend/core/theme';

const NotificationWrapper: FunctionComponent = ({ children }) => {
  return (
    <C.ChakraProvider theme={customTheme}>
      <C.Box mt={1} p={3} borderRadius="3px" boxShadow="sm" bg="white">
        {children}
      </C.Box>
    </C.ChakraProvider>
  );
};

export default NotificationWrapper;
