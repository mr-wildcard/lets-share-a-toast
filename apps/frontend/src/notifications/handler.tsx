import React, { ReactElement } from 'react';
import { UseToastOptions } from '@chakra-ui/core';
import { trigger } from 'swr';

import { APIPaths } from 'frontend/core/constants';
import SubjectAdded from './components/messages/SubjectAdded';
import SubjectEdited from './components/messages/SubjectEdited';
import SubjectStatusEdited from './components/messages/SubjectStatusEdited';
import SubjectRemoved from './components/messages/SubjectRemoved';
import TOASTCreated from './components/messages/TOASTCreated';
import TOASTInfosChanged from './components/messages/TOASTInfosChanged';
import TOASTStatusChanged from './components/messages/TOASTStatusChanged';
import NotificationSubjectAdded from 'notifications/types/NotificationSubjectAdded';
import NotificationSubjectEdited from 'notifications/types/NotificationSubjectEdited';
import NotificationSubjectRemoved from 'notifications/types/NotificationSubjectRemoved';
import NotificationSubjectEditedStatus from 'notifications/types/NotificationSubjectEditedStatus';
import NotificationTOASTCreated from 'notifications/types/NotificationTOASTCreated';
import NotificationTOASTStatusChanged from 'notifications/types/NotificationTOASTStatusChanged';
import Notification from 'notifications/types/Notification';
import Toaster from 'notifications/types/Toaster';

const getToasterConfig = (Component: ReactElement): UseToastOptions => ({
  duration: 5000,
  position: 'bottom-left',
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
      console.error('An error occured while trying to display a notification.');
      console.error(error);
      console.error('Data received from socket :', data);
    }
  };

  return {
    addSubject(data: NotificationSubjectAdded) {
      trigger(APIPaths.SUBJECTS);

      displayNotification(data)(getToasterConfig(<SubjectAdded {...data} />));
    },
    editSubject: (data: NotificationSubjectEdited) => {
      trigger(APIPaths.SUBJECTS);

      displayNotification(data)(getToasterConfig(<SubjectEdited {...data} />));
    },
    editSubjectStatus: (data: NotificationSubjectEditedStatus) => {
      trigger(APIPaths.SUBJECTS);

      displayNotification(data)(
        getToasterConfig(<SubjectStatusEdited {...data} />)
      );
    },
    removeSubject: (data: NotificationSubjectRemoved) => {
      trigger(APIPaths.SUBJECTS);

      displayNotification(data)(getToasterConfig(<SubjectRemoved {...data} />));
    },
    createTOAST: (data: NotificationTOASTCreated) => {
      trigger(APIPaths.CURRENT_TOAST);

      displayNotification(data)(getToasterConfig(<TOASTCreated {...data} />));
    },
    editTOASTInfos: (data: Notification) => {
      trigger(APIPaths.CURRENT_TOAST);

      displayNotification(data)(
        getToasterConfig(<TOASTInfosChanged {...data} />)
      );
    },
    editTOASTStatus: (data: NotificationTOASTStatusChanged) => {
      trigger(APIPaths.CURRENT_TOAST);

      displayNotification(data)(
        getToasterConfig(<TOASTStatusChanged {...data} />)
      );
    },
  };
}
