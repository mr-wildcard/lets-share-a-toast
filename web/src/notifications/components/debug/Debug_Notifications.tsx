// @ts-nocheck
import React, { useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";

import { User } from "@shared/models";
import { ToastStatus, SubjectStatus } from "@shared/enums";

import NotificationType from "../../types/NotificationType";

const fakeProfile: Partial<User> = {
  firstName: "profile.firstName",
  picture: "https://emoji.slack-edge.com/T026JHDL4/ju/7949d2a1e521513d.png",
  id: "profile.id",
};

const SESSIONS_STATUSES = Object.values(ToastStatus).filter(
  (value) => typeof value === "string"
);

const SUBJECT_STATUSES = Object.values(SubjectStatus).filter(
  (value) => typeof value === "string"
);

const Debug_Notifications = () => {
  const [opened, open] = useState(true);

  return (
    <Drawer
      isOpen={opened}
      placement="right"
      onClose={() => open(false)}
      size="xl"
    >
      <DrawerOverlay>
        <DrawerContent overflowY="auto">
          <DrawerCloseButton />
          <DrawerHeader>Notifications Debbuger</DrawerHeader>

          <DrawerBody>
            <Stack direction="row">
              <Stack>
                <Text>
                  Notifications related to TOAST object manipulations :
                </Text>
                <Button
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
                </Button>
                <Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.EDIT_TOAST_INFOS
                    );
                  }}
                >
                  Edit TOAST Infos
                </Button>
                {SESSIONS_STATUSES.map((status, index) => {
                  return (
                    <Button
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
                      <Text>TOAST status changed to :</Text> {status}
                    </Button>
                  );
                })}
              </Stack>
            </Stack>

            <br />

            <Stack direction="row">
              <Stack>
                <Text>Notifications related to subjects :</Text>
                <Button
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
                </Button>
                <Button
                  onClick={() => {
                    notifications.send(
                      fakeProfile as User,
                      NotificationType.EDIT_SUBJECT_CONTENT,
                      {
                        subjectTitle: "A cool toast subject believe me",
                      }
                    );
                  }}
                >
                  Edit a subject content
                </Button>
                {SUBJECT_STATUSES.map((status, index) => {
                  return (
                    <Button
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
                      <Text>Subject status changed to {status}</Text>
                    </Button>
                  );
                })}
              </Stack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default Debug_Notifications;
