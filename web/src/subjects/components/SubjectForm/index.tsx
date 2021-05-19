import React, { Suspense, FunctionComponent } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Spinner,
  useTheme,
} from "@chakra-ui/react";

import { Subject } from "@shared/models";

import { pageColors } from "@web/core/constants";

interface Props {
  subject?: Subject;
  isOpen: boolean;
  closeForm(): void;
}

const Form = React.lazy(
  () => import("./Form" /* webpackChunkName: "subject-form" */)
);

const SubjectForm: FunctionComponent<Props> = ({
  subject,
  closeForm,
  isOpen,
}) => {
  const theme = useTheme();

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
          <Suspense
            fallback={
              <Flex h="100%" justifyContent="center" alignItems="center">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor={theme.colors.gray["800"]}
                  color={pageColors.subjects}
                  size="xl"
                />
              </Flex>
            }
          >
            <Form subject={subject} closeForm={closeForm} />
          </Suspense>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default SubjectForm;
