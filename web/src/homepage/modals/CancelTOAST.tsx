import React, { FC, useCallback, useRef, useState } from "react";
import { Text, Stack, Button, Dialog } from "@chakra-ui/react";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getCloudFunctionCancelTOAST } from "@web/core/firebase/helpers";

interface Props {
  closeModal(): void;
}

const CancelTOAST: FC<Props> = ({ closeModal }) => {
  const [cancelling, setCancelling] = useState(false);

  const cancelBtn = useRef<HTMLButtonElement>(null);

  const cancelTOAST = useCallback(async (): Promise<void> => {
    setCancelling(true);

    try {
      const cancelToast = getCloudFunctionCancelTOAST();

      await cancelToast();

      closeModal();
    } catch (error) {
      console.error("An error occured while canceling TOAST", { error });

      setCancelling(false);
    }
  }, []);

  return (
    <Dialog.Root
      open={true}
      initialFocusEl={() => cancelBtn.current}
      onOpenChange={closeModal}
    >
      <Dialog.Content borderRadius="3px">
        <Dialog.Header textAlign="center">
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
        </Dialog.Header>
        <Dialog.Body textAlign="center" fontSize="lg" py={10}>
          <Text>
            Are you&nbsp;
            <Text as="span" fontWeight="bold">
              sure
            </Text>
            &nbsp;?
          </Text>
          <Text>You can&apos;t undo this action afterwards.</Text>
          <Text>You&apos;ll need to create a new TOAST from scratch.</Text>
        </Dialog.Body>
        <Dialog.Footer justifyContent="center">
          <Stack gap={3} direction="row">
            <Button
              onClick={cancelTOAST}
              loading={cancelling}
              disabled={cancelling}
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
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CancelTOAST;
