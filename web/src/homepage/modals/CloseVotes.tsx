import firebase from "firebase/app";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { Toast } from "@shared/models";
import { CloudFunctionName } from "@shared/firebase";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const CloseVotes: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [closingVotes, setClosingVotes] = useState(false);

  const closeVotingToast = useCallback(async (): Promise<void> => {
    setClosingVotes(true);

    try {
      await firebase.functions().httpsCallable(CloudFunctionName.CLOSE_VOTES)();
    } catch (error) {
      console.error("Couldn't close the TOAST", { error });

      setClosingVotes(false);
    }

    /*
      notifications.send(auth.profile, NotificationType.EDIT_TOAST_STATUS, {
        status: ToastStatus.VOTE_CLOSED,
      });
      */
  }, []);

  return (
    <Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      closeOnEsc={true}
      size="lg"
    >
      <ModalOverlay>
        <ModalContent borderRadius="3px">
          <ModalHeader textAlign="center">
            <Text position="relative">
              <HighlightedText bgColor={pageColors.homepage}>
                Close voting session
              </HighlightedText>
              <Image
                position="absolute"
                width={110}
                height={110}
                right={0}
                bottom="-20px"
                src="https://media.giphy.com/media/8YTmbulkH7wWNRnURI/giphy.gif"
              />
            </Text>
          </ModalHeader>

          <ModalBody>
            <Box my={5}>
              <Alert status="info" variant="left-accent">
                <Box flex={1}>
                  <AlertTitle>
                    TOAST has been created&nbsp;
                    <Text as="span" textDecoration="underline">
                      {getTOASTElapsedTimeSinceCreation(
                        new Date(currentToast.createdDate)
                      )}
                    </Text>
                    .
                  </AlertTitle>
                  <AlertDescription>
                    Be sure that people had enough time to vote.
                  </AlertDescription>
                </Box>
              </Alert>

              <Box fontSize="lg" my={10} textAlign="center">
                <Text>Are you sure you want to proceed ?</Text>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button
              colorScheme="blue"
              onClick={closeVotingToast}
              isDisabled={closingVotes}
              isLoading={closingVotes}
              loadingText="Closing votes..."
              mx={2}
            >
              Close votes!
            </Button>
            <Button
              ref={cancelBtn}
              isDisabled={closingVotes}
              onClick={closeModal}
              type="button"
              colorScheme="red"
              variant="outline"
              mx={2}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default CloseVotes;
