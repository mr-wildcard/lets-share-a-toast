import React, { FunctionComponent } from "react";
import { Drawer, DrawerContent, DrawerOverlay } from "@chakra-ui/react";

import { Subject } from "@shared/models";

interface Props {
  subject?: Subject;
  isOpen: boolean;
  closeForm(): void;
}

const Form = React.lazy(
  () => import("./Form" /* webpackChunkName: "subject-form" */)
  /*{
    loading: function Loader() {
      const theme = useTheme();

      return (
        <Flex h="100%" justifyContent="center" alignItems="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor={theme.colors.gray['800']}
            color={pageColors.subjects}
            size="xl"
          />
        </Flex>
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
    <Drawer
      isOpen={isOpen}
      onClose={closeForm}
      placement="right"
      size="xl"
      closeOnEsc={true}
    >
      <DrawerOverlay>
        <DrawerContent overflowY="auto">
          <Form subject={subject} closeForm={closeForm} />
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SubjectForm;
