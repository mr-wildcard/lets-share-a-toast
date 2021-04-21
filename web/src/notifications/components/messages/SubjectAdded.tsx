import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import Image from '@web/core/components/Image';
import NotificationSubjectAdded from '../../types/NotificationSubjectAdded';
import NotificationWrapper from '../NotificationWrapper';

const SubjectAdded: FunctionComponent<NotificationSubjectAdded> = (data) => {
  return (
    <NotificationWrapper>
      <C.Stack direction="row" spacing={2}>
        <C.Avatar name={data.username} src={data.userPicture} size="xs" />
        <C.Box position="relative" pr="40px">
          <C.Text>
            <C.Text as="span" fontWeight="bold">
              {data.username}
            </C.Text>
            &nbsp;added new subject:&nbsp;
          </C.Text>
          <C.Text>
            <C.Text as="span" fontStyle="italic">
              &laquo; {data.subjectTitle} &raquo;
            </C.Text>
            <Image
              position="absolute"
              right="-5px"
              bottom="-5px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </C.Text>
        </C.Box>
      </C.Stack>
    </NotificationWrapper>
  );
};

export default SubjectAdded;
