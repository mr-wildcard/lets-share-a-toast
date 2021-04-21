import React, { FunctionComponent, useRef } from 'react';
import * as C from '@chakra-ui/react';

import { CurrentToast, Subject, SubjectStatus, ToastStatus } from '@shared';

import HighlightedText from '@web/core/components/HighlightedText';
import Image from '@web/core/components/Image';
import { pageColors } from '@web/core/constants';
import isToast from '@web/core/helpers/isToast';

interface Props {
  subject: Subject;
  alertAboutVotingSession: boolean;
  closeModal(deleteConfirmation: boolean): void;
}

const CancelTOAST: FunctionComponent<Props> = ({
  subject,
  alertAboutVotingSession,
  closeModal,
}) => {
  const cancelTOASTCancellationBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <C.AlertDialog
      isCentered
      isOpen={true}
      leastDestructiveRef={cancelTOASTCancellationBtn}
      onClose={() => closeModal(false)}
      size="md"
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
          <C.AlertDialogBody fontSize="lg" py={10}>
            {alertAboutVotingSession && (
              <C.Box mb={5}>
                <C.Alert status="error" variant="left-accent">
                  <C.AlertIcon />
                  This awesome subject is currently in the voting session for
                  the next TOAST!
                </C.Alert>
              </C.Box>
            )}
            <C.Box textAlign="center">
              <C.Text>You&apos;re about to delete this subject:</C.Text>
              <C.Text fontWeight="bold">&quot;{subject.title}&quot;</C.Text>
              <C.Text mt={3}>Are you sure ?</C.Text>
            </C.Box>
          </C.AlertDialogBody>
          <C.AlertDialogFooter justifyContent="center">
            <C.Stack spacing={3} direction="row">
              <C.Button onClick={() => closeModal(true)} colorScheme="red">
                Yes I&apos;m sure, delete it
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
