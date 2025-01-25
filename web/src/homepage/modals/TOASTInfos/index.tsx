import React, { Suspense, FC, useRef } from "react";
import { Flex, Dialog, Spinner, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { CurrentToast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { pageColors } from "@web/core/constants";

interface Props {
  isOpen: boolean;
  closeModal(toastCreated: boolean): void;
}

const Form = React.lazy(() => import("./Form"));

const TOASTInfosForm: FC<Props> = (props) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const isCreatingToast = firebaseData.currentToast === null;

  return (
    <Dialog.Root
      onOpenChange={() => props.closeModal(false)}
      initialFocusEl={
        isCreatingToast ? undefined : () => cancelButtonRef.current
      }
      open={props.isOpen}
      closeOnEscape={true}
      size="xl"
      placement="center"
      scrollBehavior="inside"
    >
      <Dialog.Content borderRadius="3px">
        <Dialog.Header textAlign="center">
          <Text position="relative">
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
          </Text>
        </Dialog.Header>
        <Dialog.Body pb={6}>
          <Suspense
            fallback={
              <Flex my={10} align="center" justify="center">
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
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default observer(TOASTInfosForm);
