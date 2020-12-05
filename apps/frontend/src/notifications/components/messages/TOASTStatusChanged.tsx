import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { ToastStatus } from '@letsshareatoast/shared';

import Image from 'frontend/core/components/Image';
import NotificationTOASTStatusChanged from '../../types/NotificationTOASTStatusChanged';
import NotificationWrapper from '../NotificationWrapper';

const Username = ({ username }) => (
  <C.Text as="span" fontWeight="bold">
    {username}&nbsp;
  </C.Text>
);

const TOASTStatusChanged: FunctionComponent<NotificationTOASTStatusChanged> = (
  data
) => {
  return (
    <NotificationWrapper>
      <C.Stack direction="row" spacing={2}>
        <C.Avatar name={data.username} src={data.userPicture} size="xs" />
        {data.status === ToastStatus.OPEN_FOR_VOTE && (
          <C.Text position="relative" pr="35px">
            <Username username={data.username} />
            <C.Text as="span" fontWeight="bold" color="green.500">
              opened the votes&nbsp;
            </C.Text>
            for the next TOAST!
            <Image
              position="absolute"
              width={30}
              height={30}
              top="-3px"
              right="-2px"
              src="https://media.giphy.com/media/B1eGdIUyOhfPi/giphy.webp"
            />
          </C.Text>
        )}

        {data.status === ToastStatus.VOTE_CLOSED && (
          <C.Box>
            <C.Text>
              <Username username={data.username} />
              <C.Text as="span" fontWeight="bold" color="blue.600">
                closed the voting session!
              </C.Text>
            </C.Text>
            <C.Text>Thank you all for your contribution!</C.Text>
          </C.Box>
        )}

        {data.status === ToastStatus.WAITING_FOR_TOAST && (
          <C.Box position="relative" pr="50px">
            <C.Text>
              <Username username={data.username} />
              marked the TOAST as&nbsp;
              <C.Text as="span" fontWeight="bold" color="green.500">
                ready
              </C.Text>
              !
            </C.Text>
            <C.Text>See you there ;)</C.Text>
            <Image
              position="absolute"
              top="-5px"
              right="-30px"
              width={90}
              height={83}
              src="https://media.giphy.com/media/JRgO9fxNbvXn6aMz5j/giphy.gif"
            />
          </C.Box>
        )}

        {data.status === ToastStatus.CLOSED && (
          <C.Text position="relative" pr="35px">
            <Username username={data.username} />
            <C.Text as="span" fontWeight="bold" color="blue.600">
              closed&nbsp;
            </C.Text>
            the TOAST!
            <Image
              position="absolute"
              right="-4px"
              top="-7px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </C.Text>
        )}

        {data.status === ToastStatus.CANCELLED && (
          <C.Text position="relative" pr="35px">
            <Username username={data.username} />
            <C.Text as="span" fontWeight="bold" color="tomato">
              cancelled&nbsp;
            </C.Text>
            the current TOAST
            <Image
              position="absolute"
              width={41}
              height={50}
              right="-12px"
              bottom="-4px"
              src="https://media.giphy.com/media/yc2ENyer5HfbRZvYGA/giphy.webp"
            />
          </C.Text>
        )}
      </C.Stack>
    </NotificationWrapper>
  );
};

export default TOASTStatusChanged;
