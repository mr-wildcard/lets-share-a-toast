import React, { FC, useCallback, useRef, useState } from "react";
import { Alert, Box, Button, HStack, Text } from "@chakra-ui/react";

import { Toast } from "@shared/models";

import { pageColors } from "@web/core/constants";
import HighlightedText from "@web/core/components/HighlightedText";
import Image from "@web/core/components/Image";
import { getTOASTElapsedTimeSinceCreation } from "@web/core/helpers/timing";
import { getCloudFunctionCloseVotes } from "@web/core/firebase/helpers";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@web/components/ui/dialog";

interface Props {
  currentToast: Toast;
  closeModal(): void;
}

const CloseVotes: FC<Props> = ({ currentToast, closeModal }) => {
  const cancelBtn = useRef<HTMLButtonElement>(null);

  const [closingVotes, setClosingVotes] = useState(false);

  const closeVotingToast = useCallback(async (): Promise<void> => {
    setClosingVotes(true);

    try {
      const closeVotes = getCloudFunctionCloseVotes();

      await closeVotes().then(closeModal);
    } catch (error) {
      console.error("Couldn't close the TOAST", { error });

      setClosingVotes(false);
    }
  }, []);

  return (
    <DialogRoot
      placement="center"
      onOpenChange={closeModal}
      open={true}
      initialFocusEl={() => cancelBtn.current}
      closeOnEscape={true}
      size="lg"
    >
      <DialogContent borderRadius="3px">
        <DialogHeader textAlign="center">
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
        </DialogHeader>

        <DialogBody>
          <Alert.Root my={5} status="info">
            <Alert.Content>
              <Alert.Title>
                TOAST has been created&nbsp;
                <Text as="span" textDecoration="underline">
                  {getTOASTElapsedTimeSinceCreation(
                    new Date(currentToast.createdDate)
                  )}
                </Text>
                .
              </Alert.Title>
              <Alert.Description>
                Be sure that people had enough time to vote.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>

          <Box fontSize="lg" my={10} textAlign="center">
            <Text>Are you sure you want to proceed ?</Text>
          </Box>
        </DialogBody>
        <DialogFooter justifyContent="center">
          <HStack gap={4}>
            <Button
              colorPalette="blue"
              onClick={closeVotingToast}
              disabled={closingVotes}
              loading={closingVotes}
              loadingText="Closing votes..."
            >
              Close votes!
            </Button>
            <Button
              ref={cancelBtn}
              disabled={closingVotes}
              onClick={closeModal}
              type="button"
              colorPalette="red"
              variant="outline"
            >
              Cancel
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CloseVotes;
