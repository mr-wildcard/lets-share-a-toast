import React, { FunctionComponent } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, AvatarBadge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import { RouteComponentProps } from "react-router";
import { ToastStatus } from "@shared/enums";

import { header, pageColors, Pathnames, spacing } from "@web/core/constants";
import { firebaseData } from "@web/core/firebase/data";
import Image from "@web/core/components/Image";
import Logo from "./Logo";
import LinkItem from "./LinkItem";

type Props = RouteComponentProps;

const Header: FunctionComponent<Props> = ({ location }) => {
  const { pathname } = location;

  const votesAreOpened =
    firebaseData.currentToast?.status === ToastStatus.OPEN_FOR_VOTE;

  const votingPageIsOpened = pathname === Pathnames.VOTING_SESSION;

  return (
    <Box height={`${header.height}px`} as="header">
      <Flex justify="space-between" align="center" h="100%">
        <Flex flex={1} align="center">
          <Box mr={20}>
            <Logo />
          </Box>

          <LinkItem href={Pathnames.HOME} bgColor={pageColors.homepage}>
            Next TOAST
          </LinkItem>
          <Text as="span" mx={5}>
            |
          </Text>
          <LinkItem href={Pathnames.SUBJECTS} bgColor={pageColors.subjects}>
            Subjects
          </LinkItem>
          {votesAreOpened && (
            <>
              <Text as="span" mx={5}>
                |
              </Text>
              <LinkItem
                href={Pathnames.VOTING_SESSION}
                bgColor={pageColors.votingSession}
              >
                <Text position="relative" pr={1}>
                  Vote!
                  {!votingPageIsOpened && (
                    <Image
                      position="absolute"
                      top="-4px"
                      left="100%"
                      width={55}
                      height={28}
                      transform="scaleX(-1) rotate(17deg)"
                      src="https://media.giphy.com/media/cIh8FgYXjPjanIaJqm/giphy.gif"
                      title="now"
                    />
                  )}
                </Text>
              </LinkItem>
            </>
          )}
        </Flex>

        {firebaseData.connectedUser && (
          <Stack direction="row" spacing={5} align="center">
            <Text>
              Welcome
              <Text as="span" pl={1} fontWeight="bold" fontStyle="italic">
                {firebaseData.connectedUser.displayName}!
              </Text>
            </Text>

            <Box position="relative">
              <Avatar
                name={firebaseData.connectedUser.displayName!}
                src={firebaseData.connectedUser.photoURL!}
                size="sm"
              >
                <AvatarBadge boxSize="1em" bg="green.500" />
              </Avatar>
            </Box>
          </Stack>
        )}
      </Flex>
    </Box>
  );
};

export default observer(Header);
