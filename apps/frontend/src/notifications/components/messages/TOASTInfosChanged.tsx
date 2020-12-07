import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import Notification from '../../types/Notification';
import NotificationWrapper from '../NotificationWrapper';

const TOASTInfosChanged: FunctionComponent<Notification> = (data) => {
  return (
    <NotificationWrapper>
      <C.Avatar name={data.username} src={data.userPicture} size="xs" mr={1} />
      <C.Text as="span" fontWeight="bold">
        {data.username}
      </C.Text>
      &nbsp;updated current TOAST infos.
    </NotificationWrapper>
  );
};

export default TOASTInfosChanged;
