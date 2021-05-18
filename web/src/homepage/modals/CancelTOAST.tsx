import firebase from "firebase/app";
import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  Text,
  Stack,
  Button,
} from "@chakra-ui/react";

import { Toast } from "@shared/models";
import { DatabaseRefPaths } from "@shared/firebase";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";

interface Props {
  isOpen: boolean;
  currentToast: Toast;
  closeModal(): void;
}

const CancelTOAST: FunctionComponent<Props> = ({
  currentToast,
  isOpen,
  closeModal,
}) => {
  const [cancelling, setCancelling] = useState(false);

  const cancelBtn = useRef() as React.MutableRefObject<HTMLButtonElement>;

  const cancelTOAST = useCallback(async (): Promise<void> => {
    setCancelling(true);

    try {
      await firebase.database().ref(DatabaseRefPaths.CURRENT_TOAST).set(null);
    } catch (error) {
      console.error("An error occured while canceling TOAST", { error });

      setCancelling(false);
    }
  }, []);

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelBtn}
      onClose={closeModal}
    >
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="3px">
          <AlertDialogHeader textAlign="center">
            <Text position="relative" pr={5}>
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
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody textAlign="center" fontSize="lg" py={10}>
            <Text>
              Are you&nbsp;
              <Text as="span" fontWeight="bold">
                sure
              </Text>
              &nbsp;?
            </Text>
            <Text>You can&apos;t undo this action afterwards.</Text>
            <Text>You&apos;ll need to create a new TOAST from scratch.</Text>
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="center">
            <Stack spacing={3} direction="row">
              <Button
                onClick={cancelTOAST}
                isLoading={cancelling}
                isDisabled={cancelling}
                loadingText="Cancelling TOAST..."
                colorScheme="red"
              >
                I do want to cancel the TOAST
              </Button>
              <Button
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
                <Text as="span" pl={35}>
                  Do nothing
                </Text>
              </Button>
            </Stack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CancelTOAST;
