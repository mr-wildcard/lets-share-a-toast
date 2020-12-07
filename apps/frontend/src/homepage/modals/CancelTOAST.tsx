import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import * as C from '@chakra-ui/react';

import { ToastStatus, Toast } from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import { APIPaths, pageColors } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import useStores from 'frontend/core/hooks/useStores';
import NotificationType from 'frontend/notifications/types/NotificationType';

interface Props {
  isOpen: boolean;
  currentToast: Toast;

  /**
   * Ending a TOAST makes the following request to current toast
   * return a 404. So we need to revalidate the toast objects (instead of mutating).
   */
  revalidateToast(): Promise<boolean>;
  closeModal(): void;
}

const CancelTOAST: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  revalidateToast,
  closeModal,
}) => {
  const { auth, notifications } = useStores();

  const [cancelling, setCancelling] = useState(false);

  const cancelBtn = useRef();

  const cancelTOAST = useCallback(async (): Promise<void> => {
    setCancelling(true);

    const request = http();

    try {
      await request(APIPaths.CURRENT_TOAST, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: ToastStatus.CANCELLED,
        }),
      });

      await revalidateToast();

      notifications.send(auth.profile, NotificationType.EDIT_TOAST_STATUS, {
        status: ToastStatus.CANCELLED,
      });

      closeModal();
    } catch (error) {
      console.error('An error occured while canceling TOAST', { error });

      setCancelling(false);
    }
  }, [
    auth.profile,
    closeModal,
    currentToast.id,
    notifications,
    revalidateToast,
  ]);

  return (
    <C.AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelBtn}
      onClose={closeModal}
    >
      <C.AlertDialogOverlay>
        <C.AlertDialogContent borderRadius="3px">
          <C.AlertDialogHeader textAlign="center">
            <C.Text position="relative" pr={5}>
              <HighlightedText bgColor={pageColors.homepage}>
                Cancel current TOAST
              </HighlightedText>
              <Image
                position="absolute"
                right="-20px"
                bottom="-10px"
                width={99}
                height={120}
                src="https://media.giphy.com/media/yc2ENyer5HfbRZvYGA/giphy.webp"
              />
            </C.Text>
          </C.AlertDialogHeader>
          <C.AlertDialogBody textAlign="center" fontSize="lg" py={10}>
            <C.Text>
              Are you&nbsp;
              <C.Text as="span" fontWeight="bold">
                sure
              </C.Text>
              &nbsp;?
            </C.Text>
            <C.Text>You can&apos;t undo this action afterwards.</C.Text>
            <C.Text>
              You&apos;ll need to create a new TOAST from scratch.
            </C.Text>
          </C.AlertDialogBody>
          <C.AlertDialogFooter justifyContent="center">
            <C.Stack spacing={3} direction="row">
              <C.Button
                onClick={cancelTOAST}
                isLoading={cancelling}
                isDisabled={cancelling}
                loadingText="Cancelling TOAST..."
                colorScheme="red"
              >
                I do want to cancel the TOAST
              </C.Button>
              <C.Button
                position="relative"
                overflow="hidden"
                ref={cancelBtn}
                onClick={closeModal}
              >
                <Image
                  position="absolute"
                  left="5px"
                  bottom="-10px"
                  width={42}
                  height={50}
                  src="https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.webp"
                />
                <C.Text as="span" pl={35}>
                  Abord
                </C.Text>
              </C.Button>
            </C.Stack>
          </C.AlertDialogFooter>
        </C.AlertDialogContent>
      </C.AlertDialogOverlay>
    </C.AlertDialog>
  );
};

export default CancelTOAST;
