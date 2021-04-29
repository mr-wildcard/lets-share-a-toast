import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";

import { CurrentToast, Subject, User } from "@shared/models";

import { pageColors } from "@web/core/constants";

interface Props {
  subject?: Subject;
  isOpen: boolean;
  closeForm(): void;
}

const Form = React.lazy(
  () => import("./Form" /* webpackChunkName: "subject-form" */)
  /*{
    loading: function Loader() {
      const theme = C.useTheme();

      return (
        <C.Flex h="100%" justifyContent="center" alignItems="center">
          <C.Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={theme.colors.gray['800']}
            color={pageColors.subjects}
            size="xl"
          />
        </C.Flex>
      );
    },
  }
  */
);

const SubjectForm: FunctionComponent<Props> = ({
  subject,
  closeForm,
  isOpen,
}) => {
  return (
    <C.Drawer
      isOpen={isOpen}
      onClose={closeForm}
      placement="right"
      size="xl"
      closeOnEsc={true}
    >
      <C.DrawerOverlay>
        <C.DrawerContent overflowY="auto">
          <Form subject={subject} closeForm={closeForm} />
        </C.DrawerContent>
      </C.DrawerOverlay>
    </C.Drawer>
  );
};

export default SubjectForm;
