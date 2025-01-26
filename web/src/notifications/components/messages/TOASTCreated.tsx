import React, { FC } from "react";

import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";
import Image from "@web/core/components/Image";
import NotificationTOASTCreated from "../../types/NotificationTOASTCreated";
import NotificationWrapper from "../NotificationWrapper";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "@web/components/ui/avatar";

const TOASTCreated: FC<NotificationTOASTCreated> = (data) => {
  return (
    <NotificationWrapper>
      <Stack direction="row" gap={2}>
        <Avatar name={data.username} src={data.userPicture} size="xs" />
        <Box>
          <Text position="relative" pr="40px">
            <Text as="span" fontWeight="bold">
              {data.username}&nbsp;
            </Text>
            scheduled a new TOAST !
            <Image
              position="absolute"
              right={0}
              top="-7px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </Text>
          <Text>
            <Text as="span" fontWeight="bold">
              Due date:&nbsp;
            </Text>
            {getFormattedTOASTDateWithRemainingDays(new Date(data.dueDate))}
          </Text>
        </Box>
      </Stack>
    </NotificationWrapper>
  );
};

export default TOASTCreated;
