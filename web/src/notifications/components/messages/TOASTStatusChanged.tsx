import React, { FC } from "react";

import { ToastStatus } from "@shared/enums";

import Image from "@web/core/components/Image";
import NotificationTOASTStatusChanged from "../../types/NotificationTOASTStatusChanged";
import NotificationWrapper from "../NotificationWrapper";
import { Box, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "@web/components/ui/avatar";

const Username: FC<{ username: string }> = ({ username }) => (
  <Text as="span" fontWeight="bold">
    {username}&nbsp;
  </Text>
);

const TOASTStatusChanged: FC<NotificationTOASTStatusChanged> = (data) => {
  return (
    <NotificationWrapper>
      <Stack direction="row" gap={2}>
        <Avatar name={data.username} src={data.userPicture} size="xs" />
        {data.status === ToastStatus.OPEN_FOR_VOTE && (
          <Text position="relative" pr="35px">
            <Username username={data.username} />
            <Text as="span" fontWeight="bold" color="green.500">
              opened the votes&nbsp;
            </Text>
            for the next TOAST!
            <Image
              position="absolute"
              width={30}
              height={30}
              top="-3px"
              right="-2px"
              src="https://media.giphy.com/media/B1eGdIUyOhfPi/giphy.webp"
            />
          </Text>
        )}

        {data.status === ToastStatus.VOTE_CLOSED && (
          <Box>
            <Text>
              <Username username={data.username} />
              <Text as="span" fontWeight="bold" color="blue.600">
                closed the voting session!
              </Text>
            </Text>
            <Text>Thank you all for your contribution!</Text>
          </Box>
        )}

        {data.status === ToastStatus.WAITING_FOR_TOAST && (
          <Box position="relative" pr="50px">
            <Text>
              <Username username={data.username} />
              marked the TOAST as&nbsp;
              <Text as="span" fontWeight="bold" color="green.500">
                ready
              </Text>
              !
            </Text>
            <Text>See you there ;)</Text>
            <Image
              position="absolute"
              top="-5px"
              right="-30px"
              width={90}
              height={83}
              src="https://media.giphy.com/media/JRgO9fxNbvXn6aMz5j/giphy.gif"
            />
          </Box>
        )}

        {data.status === ToastStatus.CLOSED && (
          <Text position="relative" pr="35px">
            <Username username={data.username} />
            <Text as="span" fontWeight="bold" color="blue.600">
              closed&nbsp;
            </Text>
            the TOAST!
            <Image
              position="absolute"
              right="-4px"
              top="-7px"
              width={34}
              height={35}
              alt="Bravo"
              src="https://media.giphy.com/media/xUPGclxTfaPjj31CCI/giphy.webp"
            />
          </Text>
        )}

        {data.status === ToastStatus.CANCELLED && (
          <Text position="relative" pr="35px">
            <Username username={data.username} />
            <Text as="span" fontWeight="bold" color="tomato">
              cancelled&nbsp;
            </Text>
            the current TOAST
            <Image
              position="absolute"
              width={41}
              height={50}
              right="-12px"
              bottom="-4px"
              src="https://media.giphy.com/media/yc2ENyer5HfbRZvYGA/giphy.webp"
            />
          </Text>
        )}
      </Stack>
    </NotificationWrapper>
  );
};

export default TOASTStatusChanged;
