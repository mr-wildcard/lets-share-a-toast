import React, { Suspense, FC } from "react";
import { Flex, Spinner } from "@chakra-ui/react";

import {
  DrawerBackdrop,
  DrawerContent,
  DrawerRoot,
} from "@web/components/ui/drawer";
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

const SubjectForm: FC<Props> = ({ subject, closeForm, isOpen }) => {
  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={closeForm}
      placement="end"
      size="xl"
      closeOnEscape={true}
    >
      <DrawerBackdrop />
      <DrawerContent overflowY="auto">
        <Suspense
          fallback={
            <Flex h="100%" justifyContent="center" alignItems="center">
              <Spinner
                borderWidth="4px"
                animationDuration="0.65s"
                css={{ "--spinner-track-color": "colors.gray.800" }}
                color={pageColors.subjects}
                size="xl"
              />
            </Flex>
          }
        >
          <Form subject={subject} closeForm={closeForm} />
        </Suspense>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default SubjectForm;
