import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import NotificationSubjectEdited from 'notifications/types/NotificationSubjectEdited';
import NotificationWrapper from '../NotificationWrapper';
import Image from 'frontend/core/components/Image';

const SubjectEdited: FunctionComponent<NotificationSubjectEdited> = (data) => {
  return (
    <NotificationWrapper>
      <C.Stack direction="row" spacing={2}>
        <C.Avatar
          name={data.username}
          src={data.userPicture}
          size="xs"
          mr={1}
        />
        <C.Box position="relative" pr="40px">
          <C.Text>
            <C.Text as="span" fontWeight="bold">
              {data.username}&nbsp;
            </C.Text>
            edited subject:
          </C.Text>
          <C.Text>
            <C.Text as="span" fontStyle="italic">
              &laquo; {data.subjectTitle} &raquo;
            </C.Text>
            <Image
              position="absolute"
              right="-23px"
              top="-5px"
              width={61}
              height={28}
              src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
            />
          </C.Text>
        </C.Box>
      </C.Stack>
    </NotificationWrapper>
  );
};

export default SubjectEdited;
