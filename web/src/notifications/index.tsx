import React, { ElementType } from "react";
import {
  createToaster,
  Portal,
  Toast,
  Toaster as ChakraToaster,
} from "@chakra-ui/react";

import NotificationSubjectAdded from "@web/notifications/types/NotificationSubjectAdded";
import NotificationSubjectEdited from "@web/notifications/types/NotificationSubjectEdited";
import NotificationSubjectRemoved from "@web/notifications/types/NotificationSubjectRemoved";
import NotificationSubjectEditedStatus from "@web/notifications/types/NotificationSubjectEditedStatus";
import NotificationTOASTCreated from "@web/notifications/types/NotificationTOASTCreated";
import NotificationTOASTStatusChanged from "@web/notifications/types/NotificationTOASTStatusChanged";
import Notification from "@web/notifications/types/Notification";
import SubjectAdded from "./components/messages/SubjectAdded";
import SubjectEdited from "./components/messages/SubjectEdited";
import SubjectStatusEdited from "./components/messages/SubjectStatusEdited";
import SubjectRemoved from "./components/messages/SubjectRemoved";
import TOASTCreated from "./components/messages/TOASTCreated";
import TOASTInfosChanged from "./components/messages/TOASTInfosChanged";
import TOASTStatusChanged from "./components/messages/TOASTStatusChanged";

const toaster = createToaster({
  duration: 5000,
  placement: "bottom-end",
  pauseOnPageIdle: true,
});

export function toasterHandler() {
  return {
    addSubject(data: NotificationSubjectAdded) {
      toaster.create({
        meta: {
          component: SubjectAdded,
          data,
        },
      });
    },
    editSubject: (data: NotificationSubjectEdited) => {
      toaster.create({
        meta: {
          component: SubjectEdited,
          data,
        },
      });
    },
    editSubjectStatus: (data: NotificationSubjectEditedStatus) => {
      toaster.create({
        meta: {
          component: SubjectStatusEdited,
          data,
        },
      });
    },
    removeSubject: (data: NotificationSubjectRemoved) => {
      toaster.create({
        meta: {
          component: SubjectRemoved,
          data,
        },
      });
    },
    createTOAST: (data: NotificationTOASTCreated) => {
      toaster.create({
        meta: {
          component: TOASTCreated,
          data,
        },
      });
    },
    editTOASTInfos: (data: Notification) => {
      toaster.create({
        meta: {
          component: TOASTInfosChanged,
          data,
        },
      });
    },
    editTOASTStatus: (data: NotificationTOASTStatusChanged) => {
      toaster.create({
        meta: {
          component: TOASTStatusChanged,
          data,
        },
      });
    },
  };
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root>
            {toast.meta?.Component && toast.meta?.data ? (
              <toast.meta.Component {...toast.meta.data} />
            ) : null}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
