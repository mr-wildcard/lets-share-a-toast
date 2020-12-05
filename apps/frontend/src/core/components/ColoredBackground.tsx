import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';
import { observer } from 'mobx-react-lite';

import useStores from 'frontend/core/hooks/useStores';
import { spacing } from 'frontend/core/constants';

const ColoredBackground: FunctionComponent<C.BoxProps> = ({
  children,
  ...boxProps
}) => {
  const { ui } = useStores();

  return (
    <C.Box
      style={{
        backgroundColor: ui.currentPageBgColor,
        minHeight: `${ui.innerContentHeight}px`,
      }}
      borderRadius={3}
      margin={`0 ${spacing.stylizedGap}px ${spacing.stylizedGap}px`}
      padding={`${spacing.stylizedGap}px`}
      transition="background-color 500ms ease"
      {...boxProps}
    >
      {children}
    </C.Box>
  );
};

export default observer(ColoredBackground);
