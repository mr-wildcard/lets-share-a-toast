import React, { Suspense, FunctionComponent, useRef } from "react";
import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
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

const TOASTInfosForm: FunctionComponent<Props> = (props) => {
  const cancelButtonRef = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const isCreatingToast = firebaseData.currentToast === null;

  return (
    <Modal
      onClose={() => props.closeModal(false)}
      initialFocusRef={cancelButtonRef}
      isOpen={props.isOpen}
      closeOnEsc={true}
      size="lg"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay>
        <ModalContent borderRadius="3px">
          <ModalHeader textAlign="center">
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
          </ModalHeader>
          <ModalBody pb={6}>
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
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default observer(TOASTInfosForm);
