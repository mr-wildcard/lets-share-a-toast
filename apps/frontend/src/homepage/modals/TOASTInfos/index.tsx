import React, { FunctionComponent, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as C from '@chakra-ui/core';

import { CurrentToast } from '@letsshareatoast/shared';

import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import isToast from 'frontend/core/helpers/isToast';
import { pageColors } from 'frontend/core/constants';

interface Props {
  isOpen: boolean;
  currentToast?: CurrentToast;
  closeModal(toastCreated: boolean): void;
}

const Form = dynamic(
  () => import('./Form' /* webpackChunkName: "toast-infos-form" */),
  {
    loading: function Loader() {
      return (
        <C.Flex my={10} align="center" justify="center">
          <C.Spinner />
        </C.Flex>
      );
    },
  }
);

const TOASTInfosForm: FunctionComponent<Props> = (props) => {
  const cancelButtonRef = useRef();

  const isCreatingToast = !isToast(props.currentToast);

  return (
    <C.Modal
      onClose={() => props.closeModal(false)}
      initialFocusRef={cancelButtonRef}
      isOpen={props.isOpen}
      closeOnEsc={true}
      size="lg"
      isCentered
    >
      <C.ModalOverlay>
        <C.ModalContent borderRadius="3px">
          <C.ModalHeader textAlign="center">
            <C.Text position="relative">
              <HighlightedText bgColor={pageColors.homepage}>
                {isCreatingToast ? 'Start a new TOAST' : 'Edit current TOAST'}
              </HighlightedText>
              <Image
                position="absolute"
                right={0}
                top="-50px"
                width={100}
                height={100}
                src="https://media.giphy.com/media/ghNu5dkCg0yYJKhPtE/giphy.webp"
              />
            </C.Text>
          </C.ModalHeader>
          <C.ModalBody pb={6}>
            <Form
              closeModal={props.closeModal}
              currentToast={props.currentToast}
              cancelButtonRef={cancelButtonRef}
            />
          </C.ModalBody>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default TOASTInfosForm;
