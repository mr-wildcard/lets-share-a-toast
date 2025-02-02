import React, { FC, useRef } from "react";
import { Alert, Dialog, Box, Button, Stack, Text } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { pageColors } from "@web/core/constants";

interface Props {
  subject: Subject;
  alertAboutVotingSession: boolean;
  closeModal(deleteConfirmation: boolean): void;
}

const DeleteSubjectModal: FC<Props> = ({
  subject,
  alertAboutVotingSession,
  closeModal,
}) => {
  const cancelTOASTCancellationBtn = useRef<HTMLButtonElement>(null);

  return (
    <Dialog.Root
      placement="center"
      open={true}
      initialFocusEl={() => cancelTOASTCancellationBtn.current}
      onOpenChange={() => closeModal(false)}
      size="md"
    >
      <Dialog.Content borderRadius="3px">
        <Dialog.Header textAlign="center">
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
        </Dialog.Header>
        <Dialog.Body fontSize="lg" py={10}>
          {alertAboutVotingSession && (
            <Alert.Root mb={5} status="warning">
              <Alert.Indicator />
              This awesome subject is currently in the voting session for the
              next TOAST!
            </Alert.Root>
          )}

          <Box textAlign="center">
            <Text>You&apos;re about to delete this subject:</Text>
            <Text fontWeight="bold">&quot;{subject.title}&quot;</Text>
            <Text mt={3}>Are you sure ?</Text>
          </Box>
        </Dialog.Body>
        <Dialog.Footer justifyContent="center">
          <Stack gap={3} direction="row">
            <Button onClick={() => closeModal(true)} colorPalette="red">
              Yes I&apos;m sure, delete it
            </Button>
            <Button
              ref={cancelTOASTCancellationBtn}
              onClick={() => closeModal(false)}
            >
              Do nothing
            </Button>
          </Stack>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteSubjectModal;
