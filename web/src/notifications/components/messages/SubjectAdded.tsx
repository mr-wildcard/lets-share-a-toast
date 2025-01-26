import React, { FC } from "react";

import Image from "@web/core/components/Image";
import NotificationSubjectAdded from "../../types/NotificationSubjectAdded";
import NotificationWrapper from "../NotificationWrapper";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "@web/components/ui/avatar";

const SubjectAdded: FC<NotificationSubjectAdded> = (data) => {
  return (
    <NotificationWrapper>
      <Stack direction="row" gap={2}>
        <Avatar name={data.username} src={data.userPicture} size="xs" />
        <Box position="relative" pr="40px">
          <Text>
            <Text as="span" fontWeight="bold">
              {data.username}
            </Text>
            &nbsp;added new subject:&nbsp;
          </Text>
          <Text>
            <Text as="span" fontStyle="italic">
              &laquo; {data.subjectTitle} &raquo;
            </Text>
            <Image
              position="absolute"
              right="-5px"
              bottom="-5px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </Text>
        </Box>
      </Stack>
    </NotificationWrapper>
  );
};

export default SubjectAdded;
