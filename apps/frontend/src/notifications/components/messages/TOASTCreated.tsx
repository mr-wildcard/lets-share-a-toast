import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { getFormattedTOASTDateWithRemainingDays } from 'frontend/core/helpers/timing';
import Image from 'frontend/core/components/Image';
import NotificationTOASTCreated from '../../types/NotificationTOASTCreated';
import NotificationWrapper from '../NotificationWrapper';

const TOASTCreated: FunctionComponent<NotificationTOASTCreated> = (data) => {
  return (
    <NotificationWrapper>
      <C.Stack direction="row" spacing={2}>
        <C.Avatar name={data.username} src={data.userPicture} size="xs" />
        <C.Box>
          <C.Text position="relative" pr="40px">
            <C.Text as="span" fontWeight="bold">
              {data.username}&nbsp;
            </C.Text>
            scheduled a new TOAST !
            <Image
              position="absolute"
              right={0}
              top="-7px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </C.Text>
          <C.Text>
            <C.Text as="span" fontWeight="bold">
              Due date:&nbsp;
            </C.Text>
            {getFormattedTOASTDateWithRemainingDays(new Date(data.dueDate))}
          </C.Text>
        </C.Box>
      </C.Stack>
    </NotificationWrapper>
  );
};

export default TOASTCreated;
