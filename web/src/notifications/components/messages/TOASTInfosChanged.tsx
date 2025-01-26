import React, { FC } from "react";

import Notification from "../../types/Notification";
import NotificationWrapper from "../NotificationWrapper";
import { Avatar } from "@web/components/ui/avatar";
import { Text } from "@chakra-ui/react";

const TOASTInfosChanged: FC<Notification> = (data) => {
  return (
    <NotificationWrapper>
      <Avatar name={data.username} src={data.userPicture} size="xs" mr={1} />
      <Text as="span" fontWeight="bold">
        {data.username}
      </Text>
      &nbsp;updated current TOAST infos.
    </NotificationWrapper>
  );
};

export default TOASTInfosChanged;
