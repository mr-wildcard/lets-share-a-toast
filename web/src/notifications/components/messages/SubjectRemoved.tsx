import React, { FC } from "react";

import NotificationSubjectRemoved from "@web/notifications/types/NotificationSubjectRemoved";
import NotificationWrapper from "../NotificationWrapper";
import { Avatar } from "@web/components/ui/avatar";
import { Text } from "@chakra-ui/react";

const SubjectRemoved: FC<NotificationSubjectRemoved> = (data) => {
  return (
    <NotificationWrapper>
      <Avatar name={data.username} src={data.userPicture} size="xs" mr={1} />
      <Text as="span" fontWeight="bold">
        {data.username}
      </Text>
      &nbsp;removed subject&nbsp;
      <Text as="span" fontWeight="bold">
        {data.subjectTitle}
      </Text>
    </NotificationWrapper>
  );
};

export default SubjectRemoved;
