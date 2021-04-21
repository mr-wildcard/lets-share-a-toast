import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import NotificationSubjectRemoved from '@web/notifications/types/NotificationSubjectRemoved';
import NotificationWrapper from '../NotificationWrapper';

const SubjectRemoved: FunctionComponent<NotificationSubjectRemoved> = (
  data
) => {
  return (
    <NotificationWrapper>
      <C.Avatar name={data.username} src={data.userPicture} size="xs" mr={1} />
      <C.Text as="span" fontWeight="bold">
        {data.username}
      </C.Text>
      &nbsp;removed subject&nbsp;
      <C.Text as="span" fontWeight="bold">
        {data.subjectTitle}
      </C.Text>
    </NotificationWrapper>
  );
};

export default SubjectRemoved;
