import React, { FunctionComponent, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link, useHistory } from "react-router-dom";
import HighlightedText from "@web/core/components/HighlightedText";
import { pageColors } from "@web/core/constants";
import Image from "@web/core/components/Image";

interface Props {
  isOpen: boolean;
}

const PeopleCantVoteModal: FunctionComponent<Props> = ({ isOpen }) => {
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
          <AlertDialogHeader textAlign="center">
            <Text position="relative">
              <HighlightedText bgColor={pageColors.votingSession}>
                Voting session is over!
              </HighlightedText>
              <Image
                position="absolute"
                right="-20px"
                bottom="-10px"
                width={100}
                height={100}
                src="https://media.giphy.com/media/OGbmHMUlApcIHRl6zd/giphy.gif"
              />
            </Text>
          </AlertDialogHeader>

          <AlertDialogBody p={10} textAlign="center">
            Thank you for your participation!
            <br />
            The voting session is now closed.
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

export { PeopleCantVoteModal };
