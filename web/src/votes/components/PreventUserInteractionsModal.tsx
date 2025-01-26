import React, { FC, PropsWithChildren, useRef } from "react";
import {
  Link as ChakraLink,
  Dialog,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

import HighlightedText from "@web/core/components/HighlightedText";
import { pageColors } from "@web/core/constants";
import Image from "@web/core/components/Image";
import css from "./PreventUserInteractionsModal.module.css";

interface Props {
  title: string;
  isOpen: boolean;
}

const PreventUserInteractionsModal: FC<PropsWithChildren<Props>> = ({
  isOpen,
  title,
  children,
}) => {
  const push = useNavigate();

  const cancelBtn = useRef<HTMLAnchorElement>(null);

  return (
    <Dialog.Root
      open={isOpen}
      preventScroll={true}
      trapFocus={true}
      placement="center"
      closeOnEscape={false}
      closeOnInteractOutside={false}
      initialFocusEl={() => cancelBtn.current}
      onOpenChange={() => {
        push("/");
      }}
    >
      <Dialog.Content>
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
        <Dialog.Header textAlign="center">
          <Text position="relative">
            <HighlightedText bgColor={pageColors.votingSession}>
              {title}
            </HighlightedText>
          </Text>
        </Dialog.Header>

        <Dialog.Body>
          <Box padding={10} textAlign="center">
            {children}
          </Box>
        </Dialog.Body>

        <Dialog.Footer justifyContent="center">
          <ChakraLink asChild>
            <Link to="/">
              <Image
                transform="translate(-8px, -6px)"
                width={60}
                height={60}
                src="https://media.giphy.com/media/cP6REpq2OvhLajI0RY/giphy.gif"
              />
              <Text as="span">Bring me back to homepage</Text>
            </Link>
          </ChakraLink>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { PreventUserInteractionsModal };
