import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { MenuItem } from 'react-contextmenu';

import { SubjectStatus } from '@letsshareatoast/shared';

interface Props {
  onClick: () => void;
}

const ContextMenuItem: FunctionComponent<Props> = ({ onClick, children }) => {
  const theme = C.useTheme();

  return (
    <MenuItem onClick={onClick}>
      <C.Box
        d="flex"
        alignItems="center"
        cursor="pointer"
        _hover={{
          bg: theme.colors.gray['100'],
        }}
        p={2}
        px={3}
      >
        {children}
      </C.Box>
    </MenuItem>
  );
};

export default ContextMenuItem;
