import React, { FC } from "react";

import NotificationSubjectEdited from "@web/notifications/types/NotificationSubjectEdited";
import Image from "@web/core/components/Image";
import NotificationWrapper from "../NotificationWrapper";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "@web/components/ui/avatar";

const SubjectEdited: FC<NotificationSubjectEdited> = (data) => {
  return (
    <NotificationWrapper>
      <Stack direction="row" gap={2}>
        <Avatar name={data.username} src={data.userPicture} size="xs" mr={1} />
        <Box position="relative" pr="40px">
          <Text>
            <Text as="span" fontWeight="bold">
              {data.username}&nbsp;
            </Text>
            edited subject:
          </Text>
          <Text>
            <Text as="span" fontStyle="italic">
              &laquo; {data.subjectTitle} &raquo;
            </Text>
            <Image
              position="absolute"
              right="-23px"
              top="-5px"
              width={61}
              height={28}
              src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
            />
          </Text>
        </Box>
      </Stack>
    </NotificationWrapper>
  );
};

export default SubjectEdited;
