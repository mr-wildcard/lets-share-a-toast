import React from "react";
import { observer } from "mobx-react-lite";
import * as C from "@chakra-ui/react";
import { useLocation } from "react-router";
import { ToastStatus } from "@shared/enums";

import { header, pageColors, Pathnames, spacing } from "@web/core/constants";
import { firebaseData } from "@web/core/firebase/data";
import Image from "@web/core/components/Image";
import useStores from "@web/core/hooks/useStores";
import Logo from "./Logo";
import LinkItem from "./LinkItem";

const Header = () => {
  const { pathname } = useLocation();

  const votesAreOpened =
    firebaseData.currentToast?.status === ToastStatus.OPEN_FOR_VOTE;

  const votingPageIsOpened = pathname === Pathnames.VOTING_SESSION;

  return (
    <C.Box
      px={`${spacing.stylizedGap}px`}
      height={`${header.height}px`}
      as="header"
    >
      <C.Flex justify="space-between" align="center" h="100%">
        <C.Flex flex={1} align="center">
          <C.Box mr={20}>
            <Logo />
          </C.Box>

          <LinkItem href={Pathnames.HOME} bgColor={pageColors.homepage}>
            Next TOAST
          </LinkItem>
          <C.Text as="span" mx={5}>
            |
          </C.Text>
          <LinkItem href={Pathnames.SUBJECTS} bgColor={pageColors.subjects}>
            Subjects
          </LinkItem>
          {votesAreOpened && (
            <>
              <C.Text as="span" mx={5}>
                |
              </C.Text>
              <LinkItem
                href={Pathnames.VOTING_SESSION}
                bgColor={pageColors.votingSession}
              >
                <C.Text position="relative" pr={1}>
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
                </C.Text>
              </LinkItem>
            </>
          )}
        </C.Flex>

        {firebaseData.connectedUser && (
          <C.Stack direction="row" spacing={5} align="center">
            <C.Text>
              Welcome
              <C.Text as="span" pl={1} fontWeight="bold" fontStyle="italic">
                {firebaseData.connectedUser.displayName}!
              </C.Text>
            </C.Text>

            <C.Box position="relative">
              <C.Avatar
                name={firebaseData.connectedUser.displayName!}
                src={firebaseData.connectedUser.photoURL!}
                size="sm"
              >
                <C.AvatarBadge boxSize="1em" bg="green.500" />
              </C.Avatar>
            </C.Box>
          </C.Stack>
        )}
      </C.Flex>
    </C.Box>
  );
};

export default observer(Header);
