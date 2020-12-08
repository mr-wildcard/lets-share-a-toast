import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import * as C from '@chakra-ui/react';

import { ToastStatus, Toast } from '@letsshareatoast/shared';

import http from 'frontend/core/httpClient';
import { APIPaths, pageColors } from 'frontend/core/constants';
import HighlightedText from 'frontend/core/components/HighlightedText';
import Image from 'frontend/core/components/Image';
import NotificationType from 'frontend/notifications/types/NotificationType';
import useStores from 'frontend/core/hooks/useStores';

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

const EndTOAST: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  revalidateToast,
  closeModal,
}) => {
  const { auth, notifications } = useStores();

  const [endingTOAST, setEndingTOAST] = useState(false);

  const cancelBtn = useRef();

  const endTOAST = useCallback(async (): Promise<void> => {
    setEndingTOAST(true);

    const request = http();

    try {
      await request(APIPaths.CURRENT_TOAST_STATUS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: ToastStatus.CLOSED,
        }),
      });

      await revalidateToast();

      notifications.send(auth.profile, NotificationType.EDIT_TOAST_STATUS, {
        status: ToastStatus.CLOSED,
      });

      closeModal();
    } catch (error) {
      console.log('An error occured while ending TOAST', { error });

      setEndingTOAST(false);
    }
  }, [
    closeModal,
    currentToast.id,
    revalidateToast,
    notifications,
    auth.profile,
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
                End current TOAST
              </HighlightedText>
              <Image
                position="absolute"
                right={0}
                bottom="-5px"
                width={120}
                height={120}
                src="https://media.giphy.com/media/RLVLZDCYkjrdwlUQSt/giphy.webp"
              />
            </C.Text>
          </C.AlertDialogHeader>
          <C.AlertDialogBody textAlign="center" fontSize="lg" py={10}>
            <C.Text>
              Are you&nbsp;
              <C.Text as="span" fontWeight="bold">
                sure
              </C.Text>
              &nbsp;you want to&nbsp;
              <C.Text as="span" textDecoration="underline">
                end
              </C.Text>
              &nbsp;this TOAST?
            </C.Text>
          </C.AlertDialogBody>
          <C.AlertDialogFooter justifyContent="center">
            <C.Stack spacing={3} direction="row">
              <C.Button
                onClick={endTOAST}
                isLoading={endingTOAST}
                isDisabled={endingTOAST}
                loadingText="Ending TOAST..."
                colorScheme="green"
              >
                I do want to end the TOAST
              </C.Button>
              <C.Button
                position="relative"
                overflow="hidden"
                ref={cancelBtn}
                onClick={closeModal}
              >
                Abord
              </C.Button>
            </C.Stack>
          </C.AlertDialogFooter>
        </C.AlertDialogContent>
      </C.AlertDialogOverlay>
    </C.AlertDialog>
  );
};

export default EndTOAST;
