import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { SubjectStatus } from '@letsshareatoast/shared';

import NotificationSubjectEditedStatus from 'notifications/types/NotificationSubjectEditedStatus';
import NotificationWrapper from '../NotificationWrapper';

const SubjectStatusEdited: FunctionComponent<NotificationSubjectEditedStatus> = (
  data
) => {
  return (
    <NotificationWrapper>
      <C.Stack direction="row" spacing={2}>
        <C.Avatar name={data.username} src={data.userPicture} size="xs" />
        <C.Box>
          <C.Text as="span" fontWeight="bold">
            {data.username}&nbsp;
          </C.Text>
          marked the following subject as: &nbsp;
          {data.newStatus === SubjectStatus.AVAILABLE && (
            <C.Badge variant="solid" colorScheme="green">
              Available for a TOAST
            </C.Badge>
          )}
          {data.newStatus === SubjectStatus.NOT_AVAILABLE && (
            <C.Badge variant="solid" colorScheme="red">
              Unavailable
            </C.Badge>
          )}
          {data.newStatus === SubjectStatus.DONE && (
            <C.Badge variant="solid">ALREADY GIVEN</C.Badge>
          )}
          <C.Text fontStyle="italic">
            &laquo; {data.subjectTitle} &raquo;
          </C.Text>
        </C.Box>
      </C.Stack>
    </NotificationWrapper>
  );
};

export default SubjectStatusEdited;
