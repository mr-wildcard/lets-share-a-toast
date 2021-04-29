import React from "react";
import { observer } from "mobx-react-lite";
import * as C from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router";
import { ToastStatus } from "@shared/enums";

import { header, pageColors, Pathnames, spacing } from "@web/core/constants";
import firebase from "@web/core/firebase";
import Image from "@web/core/components/Image";
import useStores from "@web/core/hooks/useStores";
import Logo from "./Logo";
import LinkItem from "./LinkItem";

const Header = () => {
  const { pathname } = useLocation();

  const {
    currentToastSession: { toast },
    appLoader,
    notifications,
  } = useStores();

  const votesAreOpened =
    firebase.currentToast?.status === ToastStatus.OPEN_FOR_VOTE;

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

        {firebase.connectedUser && (
          <C.Stack direction="row" spacing={5} align="center">
            <C.Text>
              Welcome
              <C.Text as="span" pl={1} fontWeight="bold" fontStyle="italic">
                {firebase.connectedUser.displayName}!
              </C.Text>
            </C.Text>

            <C.Box position="relative">
              <C.Avatar
                name={firebase.connectedUser.displayName}
                src={firebase.connectedUser.photoURL}
                size="sm"
              >
                <C.AvatarBadge boxSize="1em" bg="green.500" />
              </C.Avatar>
              <C.Menu closeOnSelect={false}>
                <C.MenuButton
                  as={C.IconButton}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  opacity={0}
                  icon={<SettingsIcon />}
                  size="sm"
                  aria-label="User settings"
                  title="Your settings"
                  borderRadius="full"
                  _hover={{ opacity: 1 }}
                />
                <C.MenuList>
                  <C.MenuItem
                    onClick={() => {
                      notifications.showNotifications = !notifications.showNotifications;
                    }}
                  >
                    <FontAwesomeIcon
                      icon={
                        notifications.showNotifications ? faBell : faBellSlash
                      }
                    />
                    <C.Text as="span" pl={3}>
                      Notifications
                    </C.Text>
                  </C.MenuItem>
                </C.MenuList>
              </C.Menu>
            </C.Box>
          </C.Stack>
        )}
      </C.Flex>
    </C.Box>
  );
};

export default observer(Header);
