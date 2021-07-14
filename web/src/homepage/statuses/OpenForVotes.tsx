import { observer } from "mobx-react-lite";
import React, { FunctionComponent } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Toast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";
import Image from "@web/core/components/Image";
import { Pathnames } from "@web/core/constants";
import WhosInChargeRecap from "./WhosInChargeRecap";
import css from "./OpenForVotes.module.css";

interface Props {
  toast: Toast;
}

const OpenForVotes: FunctionComponent<Props> = ({ toast }) => {
  const votingSessionCreated = !!firebaseData.votingSession;

  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={5}>
        Votes are opened for the upcoming TOAST !
      </Text>

      <Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </Box>

      <Box d="inline-block" position="relative">
        <Button
          as={Link}
          to={Pathnames.VOTING_SESSION}
          className={css.link}
          disabled={!votingSessionCreated}
          position="relative"
          color="orange.500"
          cursor="pointer"
          variant="outline"
          borderColor="orange.500"
          bg="white"
          size="lg"
          px={4}
        >
          <Text pl="60px">Join voting session !</Text>
        </Button>
        <Image
          position="absolute"
          left="-10px"
          top="-10px"
          width={80}
          height={80}
          src="https://media.giphy.com/media/B1eGdIUyOhfPi/giphy.webp"
          pointerEvents="none"
        />
      </Box>
    </Box>
  );
};

export default observer(OpenForVotes);
