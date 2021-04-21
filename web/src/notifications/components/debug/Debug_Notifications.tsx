import React, { useState } from 'react';
import * as C from '@chakra-ui/react';

import { ToastStatus, User, SubjectStatus } from '@shared';

import useStores from '@web/core/hooks/useStores';
import NotificationType from '../../types/NotificationType';

const fakeProfile: Partial<User> = {
  firstName: 'profile.firstName',
  picture: 'https://emoji.slack-edge.com/T026JHDL4/ju/7949d2a1e521513d.png',
  id: 'profile.id',
};

const SESSIONS_STATUSES = Object.values(ToastStatus).filter(
  (value) => typeof value === 'string'
);

const SUBJECT_STATUSES = Object.values(SubjectStatus).filter(
  (value) => typeof value === 'string'
);

const Debug_Notifications = () => {
  const [opened, open] = useState(true);
  const { notifications } = useStores();

  return (
    <C.Drawer
      isOpen={opened}
      placement="right"
      onClose={() => open(false)}
      size="xl"
    >
      <C.DrawerOverlay>
        <C.DrawerContent overflowY="auto">
          <C.DrawerCloseButton />
          <C.DrawerHeader>Notifications Debbuger</C.DrawerHeader>

          <C.DrawerBody>
            <C.Stack direction="row">
              <C.Stack>
                <C.Text>
                  Notifications related to TOAST object manipulations :
                </C.Text>
                <C.Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.CREATE_TOAST,
                      {
                        dueDate: new Date(2030, 1).toString(),
                      }
                    );
                  }}
                >
                  Create TOAST
                </C.Button>
                <C.Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.EDIT_TOAST_INFOS
                    );
                  }}
                >
                  Edit TOAST Infos
                </C.Button>
                {SESSIONS_STATUSES.map((status, index) => {
                  return (
                    <C.Button
                      justifyContent="space-between"
                      key={index}
                      onClick={() => {
                        notifications.send(
                          fakeProfile as User,
                          NotificationType.EDIT_TOAST_STATUS,
                          {
                            status,
                          }
                        );
                      }}
                    >
                      <C.Text>TOAST status changed to :</C.Text> {status}
                    </C.Button>
                  );
                })}
              </C.Stack>
            </C.Stack>

            <br />

            <C.Stack direction="row">
              <C.Stack>
                <C.Text>Notifications related to subjects :</C.Text>
                <C.Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.ADD_SUBJECT,
                      {
                        subjectTitle: "A toast subject quite cool isn't it ?",
                      }
                    );
                  }}
                >
                  Create a subject
                </C.Button>
                <C.Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.EDIT_SUBJECT_CONTENT,
                      {
                        subjectTitle: 'A cool toast subject believe me',
                      }
                    );
                  }}
                >
                  Edit a subject content
                </C.Button>
                {SUBJECT_STATUSES.map((status, index) => {
                  return (
                    <C.Button
                      justifyContent="space-between"
                      key={index}
                      onClick={() => {
                        notifications.send(
                          fakeProfile as User,
                          NotificationType.EDIT_SUBJECT_STATUS,
                          {
                            subjectTitle:
                              "An awesome TOAST subject with a quite long title don't you think?? Me yes! LOL",
                            newStatus: status,
                          }
                        );
                      }}
                    >
                      <C.Text>Subject status changed to {status}</C.Text>
                    </C.Button>
                  );
                })}
              </C.Stack>
            </C.Stack>
          </C.DrawerBody>
        </C.DrawerContent>
      </C.DrawerOverlay>
    </C.Drawer>
  );
};

export default Debug_Notifications;
