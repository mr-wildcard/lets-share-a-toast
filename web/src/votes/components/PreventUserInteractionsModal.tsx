import React, { FunctionComponent, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";

import HighlightedText from "@web/core/components/HighlightedText";
import { pageColors } from "@web/core/constants";
import Image from "@web/core/components/Image";
import css from "./PreventUserInteractionsModal.module.css";

interface Props {
  title: string;
  isOpen: boolean;
}

const PreventUserInteractionsModal: FunctionComponent<Props> = ({
  isOpen,
  title,
  children,
}) => {
  const { push } = useHistory();

  const cancelBtn = useRef() as React.MutableRefObject<HTMLAnchorElement>;

  return (
    <AlertDialog
      isOpen={isOpen}
      blockScrollOnMount={true}
      trapFocus={true}
      isCentered={true}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      leastDestructiveRef={cancelBtn}
      onClose={() => {
        push("/");
      }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <Box
            position="absolute"
            w="full"
            h="100px"
            bottom="calc(100% - 17px)"
            className={css.happyToast}
          >
            <Image
              position="absolute"
              width={100}
              height={100}
              src="https://media.giphy.com/media/OGbmHMUlApcIHRl6zd/giphy.gif"
            />
          </Box>
          <AlertDialogHeader textAlign="center">
            <Text position="relative">
              <HighlightedText bgColor={pageColors.votingSession}>
                {title}
              </HighlightedText>
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody>
            <Box p={10} textAlign="center">
              {children}
            </Box>
          </AlertDialogBody>

          <AlertDialogFooter justifyContent="center">
            <Button as={Link} to="/" innerRef={cancelBtn}>
              <Image
                transform="translate(-8px, -6px)"
                width={60}
                height={60}
                src="https://media.giphy.com/media/cP6REpq2OvhLajI0RY/giphy.gif"
              />
              <Text as="span">Bring me back to homepage</Text>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { PreventUserInteractionsModal };
