import React, { ReactElement } from "react";
import { UseToastOptions } from "@chakra-ui/react";

import NotificationSubjectAdded from "@web/notifications/types/NotificationSubjectAdded";
import NotificationSubjectEdited from "@web/notifications/types/NotificationSubjectEdited";
import NotificationSubjectRemoved from "@web/notifications/types/NotificationSubjectRemoved";
import NotificationSubjectEditedStatus from "@web/notifications/types/NotificationSubjectEditedStatus";
import NotificationTOASTCreated from "@web/notifications/types/NotificationTOASTCreated";
import NotificationTOASTStatusChanged from "@web/notifications/types/NotificationTOASTStatusChanged";
import Notification from "@web/notifications/types/Notification";
import Toaster from "@web/notifications/types/Toaster";
import SubjectAdded from "./components/messages/SubjectAdded";
import SubjectEdited from "./components/messages/SubjectEdited";
import SubjectStatusEdited from "./components/messages/SubjectStatusEdited";
import SubjectRemoved from "./components/messages/SubjectRemoved";
import TOASTCreated from "./components/messages/TOASTCreated";
import TOASTInfosChanged from "./components/messages/TOASTInfosChanged";
import TOASTStatusChanged from "./components/messages/TOASTStatusChanged";

const getToasterConfig = (Component: ReactElement): UseToastOptions => ({
  duration: 5000,
  position: "bottom-left",
  render: function Notification() {
    return Component;
  },
});

export default function toasterHandler(toaster: Toaster) {
  /**
   * Wrap into a try catch any attempt to display a notification.
   * This way, no petit rigolo can try to emit bullshit from their own socket instance.
   * @param data
   */
  const displayNotification = <T extends Notification>(data: T) => (
    notificationOptions: UseToastOptions
  ): void => {
    try {
      toaster(notificationOptions);
    } catch (error) {
      console.error("An error occured while trying to display a notification.");
      console.error(error);
      console.error("Data received from socket :", data);
    }
  };

  return {
    addSubject(data: NotificationSubjectAdded) {
      displayNotification(data)(getToasterConfig(<SubjectAdded {...data} />));
    },
    editSubject: (data: NotificationSubjectEdited) => {
      displayNotification(data)(getToasterConfig(<SubjectEdited {...data} />));
    },
    editSubjectStatus: (data: NotificationSubjectEditedStatus) => {
      displayNotification(data)(
        getToasterConfig(<SubjectStatusEdited {...data} />)
      );
    },
    removeSubject: (data: NotificationSubjectRemoved) => {
      displayNotification(data)(getToasterConfig(<SubjectRemoved {...data} />));
    },
    createTOAST: (data: NotificationTOASTCreated) => {
      displayNotification(data)(getToasterConfig(<TOASTCreated {...data} />));
    },
    editTOASTInfos: (data: Notification) => {
      displayNotification(data)(
        getToasterConfig(<TOASTInfosChanged {...data} />)
      );
    },
    editTOASTStatus: (data: NotificationTOASTStatusChanged) => {
      displayNotification(data)(
        getToasterConfig(<TOASTStatusChanged {...data} />)
      );
    },
  };
}
