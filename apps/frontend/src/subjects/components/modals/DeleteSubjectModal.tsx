import React, { FunctionComponent, useRef } from 'react';
import * as C from '@chakra-ui/react';

import { Subject } from '@letsshareatoast/shared';

import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import { pageColors } from 'frontend/core/constants';

interface Props {
  subject: Subject;
  closeModal(deleteConfirmation: boolean): void;
}

const CancelTOAST: FunctionComponent<Props> = ({ subject, closeModal }) => {
  const cancelTOASTCancellationBtn = useRef();

  return (
    <C.AlertDialog
      isCentered
      isOpen={true}
      leastDestructiveRef={cancelTOASTCancellationBtn}
      onClose={() => closeModal(false)}
      size="sm"
    >
      <C.AlertDialogOverlay>
        <C.AlertDialogContent borderRadius="3px">
          <C.AlertDialogHeader textAlign="center">
            <C.Text as="span" position="relative" pr={5}>
              <HighlightedText bgColor={pageColors.subjects}>
                Delete subject
              </HighlightedText>
              <Image
                position="absolute"
                left="100%"
                bottom="-20px"
                width={72}
                height={120}
                src="https://media.giphy.com/media/f3FohJgTNldsBZeJcm/giphy.webp"
              />
            </C.Text>
          </C.AlertDialogHeader>
          <C.AlertDialogBody textAlign="center" fontSize="lg" py={10}>
            <C.Text>You&apos;re about to delete this subject:</C.Text>
            <C.Text py={2} fontWeight="bold">
              &quot;{subject.title}&quot;
            </C.Text>
            <C.Text>Are you sure ?</C.Text>
          </C.AlertDialogBody>
          <C.AlertDialogFooter justifyContent="center">
            <C.Stack spacing={3} direction="row">
              <C.Button onClick={() => closeModal(true)} colorScheme="red">
                Yes I&apos;m sure, delete it anyway
              </C.Button>
              <C.Button
                ref={cancelTOASTCancellationBtn}
                onClick={() => closeModal(false)}
              >
                Cancel
              </C.Button>
            </C.Stack>
          </C.AlertDialogFooter>
        </C.AlertDialogContent>
      </C.AlertDialogOverlay>
    </C.AlertDialog>
  );
};

export default CancelTOAST;
