import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import * as C from "@chakra-ui/react";
import { mutate } from "swr";

import { Toast } from "@shared/models";
import { ToastStatus } from "@shared/enums";

import http from "@web/core/httpClient";
import { APIPaths, pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import useStores from "@web/core/hooks/useStores";
import Image from "@web/core/components/Image";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import toastHasDeadheatSubjects from "@web/core/helpers/toastHasDeadheatSubjects";
import NotificationType from "@web/notifications/types/NotificationType";

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
  const { auth, notifications } = useStores();

  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const [closingVotes, setClosingVotes] = useState(false);

  const closeVotingToast = useCallback(async (): Promise<void> => {
    setClosingVotes(true);

    const request = http();

    try {
      const updatedToast: Toast = await request(APIPaths.TOAST_CURRENT_STATUS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: ToastStatus.VOTE_CLOSED,
        }),
      });

      // @ts-ignore
      notifications.send(auth.profile, NotificationType.EDIT_TOAST_STATUS, {
        status: ToastStatus.VOTE_CLOSED,
      });

      closeModal();
    } catch (error) {
      console.error("An error occured while closing votes", { error });

      setClosingVotes(false);
    }
  }, [auth.profile, closeModal, currentToast.id, notifications]);

  return (
    <C.Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      initialFocusRef={cancelBtn}
      closeOnEsc={true}
      size="lg"
    >
      <C.ModalOverlay>
        <C.ModalContent borderRadius="3px">
          <C.ModalHeader textAlign="center">
            <C.Text position="relative">
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
            </C.Text>
          </C.ModalHeader>

          <C.ModalBody>
            <C.Box my={5}>
              <C.Alert status="info" variant="left-accent">
                <C.Box flex={1}>
                  <C.AlertTitle>
                    TOAST has been created&nbsp;
                    <C.Text as="span" textDecoration="underline">
                      {getTOASTElapsedTimeSinceCreation(
                        new Date(currentToast.createdDate)
                      )}
                    </C.Text>
                    .
                  </C.AlertTitle>
                  <C.AlertDescription>
                    Be sure that people had enough time to vote.
                  </C.AlertDescription>
                </C.Box>
              </C.Alert>

              <C.Box fontSize="lg" my={10} textAlign="center">
                <C.Text>Are you sure you want to proceed ?</C.Text>
              </C.Box>
            </C.Box>
          </C.ModalBody>
          <C.ModalFooter justifyContent="center">
            <C.Button
              colorScheme="blue"
              onClick={closeVotingToast}
              isDisabled={closingVotes}
              isLoading={closingVotes}
              loadingText="Closing votes..."
              mx={2}
            >
              Close votes!
            </C.Button>
            <C.Button
              ref={cancelBtn}
              isDisabled={closingVotes}
              onClick={closeModal}
              type="button"
              colorScheme="red"
              variant="outline"
              mx={2}
            >
              Cancel
            </C.Button>
          </C.ModalFooter>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default CloseVotes;
