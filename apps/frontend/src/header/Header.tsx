import React, { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import * as C from '@chakra-ui/core';
import { SettingsIcon } from '@chakra-ui/icons';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import { CurrentToast, User, ToastStatus } from '@letsshareatoast/shared';

import {
  APIPaths,
  header,
  pageColors,
  Pathnames,
  spacing,
} from 'frontend/core/constants';
import Image from 'frontend/core/components/Image';
import useStores from 'frontend/core/hooks/useStores';
import getUserFullname from 'frontend/core/helpers/getUserFullname';
import isToast from 'frontend/core/helpers/isToast';
import Logo from './Logo';
import LinkItem from './LinkItem';

const Header = () => {
  const { pathname } = useRouter();

  const { auth, appLoading, notifications } = useStores();

  const { data: profile } = useSWR<User>(APIPaths.PROFILE, {
    // We don't need profile to be fetched more than once.
    revalidateOnFocus: false,
  });

  const { data: currentToast } = useSWR<CurrentToast>(APIPaths.CURRENT_TOAST);

  const votesAreOpened = useMemo(() => {
    return (
      isToast(currentToast) && currentToast.status === ToastStatus.OPEN_FOR_VOTE
    );
  }, [currentToast]);

  const votingPageIsOpened = pathname === Pathnames.VOTING_SESSION;

  useEffect(() => {
    if (profile) {
      auth.profile = profile;
      appLoading.profileLoaded = true;
    }
  }, [profile, auth, appLoading]);

  return (
    <C.Box px={`${spacing.stylizedGap}px`} height={header.height} as="header">
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

        {profile && (
          <C.Stack direction="row" spacing={5} align="center">
            <C.Text>
              Welcome
              <C.Text as="span" pl={1} fontWeight="bold" fontStyle="italic">
                {profile.firstName}!
              </C.Text>
            </C.Text>

            <C.Box position="relative">
              <C.Avatar
                name={getUserFullname(profile)}
                src={profile.picture}
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
                  borderRadius="full"
                  _hover={{ opacity: 0.95 }}
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
