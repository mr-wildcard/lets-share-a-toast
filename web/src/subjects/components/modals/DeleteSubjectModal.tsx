import React, { FunctionComponent, useRef } from "react";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Subject } from "@shared/models";

import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { pageColors } from "@web/core/constants";

interface Props {
  subject: Subject;
  alertAboutVotingSession: boolean;
  closeModal(deleteConfirmation: boolean): void;
}

const DeleteSubjectModal: FunctionComponent<Props> = ({
  subject,
  alertAboutVotingSession,
  closeModal,
}) => {
  const cancelTOASTCancellationBtn =
    useRef() as React.MutableRefObject<HTMLButtonElement>;

  return (
    <AlertDialog
      isCentered
      isOpen={true}
      leastDestructiveRef={cancelTOASTCancellationBtn}
      onClose={() => closeModal(false)}
      size="md"
    >
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="3px">
          <AlertDialogHeader textAlign="center">
            <Text as="span" position="relative" pr={5}>
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
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody fontSize="lg" py={10}>
            {alertAboutVotingSession && (
              <Alert mb={5} status="warning" variant="left-accent">
                <AlertIcon />
                This awesome subject is currently in the voting session for the
                next TOAST!
              </Alert>
            )}

            <Box textAlign="center">
              <Text>You&apos;re about to delete this subject:</Text>
              <Text fontWeight="bold">&quot;{subject.title}&quot;</Text>
              <Text mt={3}>Are you sure ?</Text>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="center">
            <Stack spacing={3} direction="row">
              <Button onClick={() => closeModal(true)} colorScheme="red">
                Yes I&apos;m sure, delete it
              </Button>
              <Button
                ref={cancelTOASTCancellationBtn}
                onClick={() => closeModal(false)}
              >
                Do nothing
              </Button>
            </Stack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteSubjectModal;
