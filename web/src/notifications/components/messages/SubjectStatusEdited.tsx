import React, { FC } from "react";

import { SubjectStatus } from "@shared/enums";

import NotificationSubjectEditedStatus from "@web/notifications/types/NotificationSubjectEditedStatus";
import NotificationWrapper from "../NotificationWrapper";
import { Badge, Box, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "@web/components/ui/avatar";

const SubjectStatusEdited: FC<NotificationSubjectEditedStatus> = (data) => {
  return (
    <NotificationWrapper>
      <Stack direction="row" gap={2}>
        <Avatar name={data.username} src={data.userPicture} size="xs" />
        <Box>
          <Text as="span" fontWeight="bold">
            {data.username}&nbsp;
          </Text>
          marked the following subject as: &nbsp;
          {data.newStatus === SubjectStatus.AVAILABLE && (
            <Badge variant="solid" colorScheme="green">
              Available for a TOAST
            </Badge>
          )}
          {data.newStatus === SubjectStatus.UNAVAILABLE && (
            <Badge variant="solid" colorScheme="red">
              Unavailable
            </Badge>
          )}
          {data.newStatus === SubjectStatus.DONE && (
            <Badge variant="solid">ALREADY GIVEN</Badge>
          )}
          <Text fontStyle="italic">&laquo; {data.subjectTitle} &raquo;</Text>
        </Box>
      </Stack>
    </NotificationWrapper>
  );
};

export default SubjectStatusEdited;
