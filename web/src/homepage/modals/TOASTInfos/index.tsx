import React, { Suspense, FC, useRef } from "react";
import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CurrentToast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { pageColors } from "@web/core/constants";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "@web/components/ui/dialog";

interface Props {
  isOpen: boolean;
  closeModal(toastCreated: boolean): void;
}

const Form = React.lazy(() => import("./Form"));

const TOASTInfosForm: FC<Props> = (props) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const isCreatingToast = firebaseData.currentToast === null;

  return (
    <DialogRoot
      onOpenChange={() => props.closeModal(false)}
      initialFocusEl={
        isCreatingToast ? undefined : () => cancelButtonRef.current
      }
      open={props.isOpen}
      closeOnEscape={true}
      size="md"
      placement="center"
      scrollBehavior="inside"
    >
      <DialogContent borderRadius="3px">
        <DialogHeader textAlign="center">
          <Heading position="relative">
            <HighlightedText bgColor={pageColors.homepage}>
              {isCreatingToast ? "Start a new TOAST" : "Edit current TOAST"}
            </HighlightedText>
            <Image
              position="absolute"
              right={0}
              top="-50px"
              width={100}
              height={100}
              src="https://media.giphy.com/media/ghNu5dkCg0yYJKhPtE/giphy.webp"
            />
          </Heading>
        </DialogHeader>
        <DialogBody>
          <Suspense
            fallback={
              <Flex marginY={10} align="center" justify="center">
                <Spinner />
              </Flex>
            }
          >
            <Form
              currentToast={firebaseData.currentToast as CurrentToast}
              closeModal={props.closeModal}
              cancelButtonRef={cancelButtonRef}
            />
          </Suspense>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default observer(TOASTInfosForm);
