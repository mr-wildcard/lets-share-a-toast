import React, { FunctionComponent } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Toast } from "@shared/models";

import Image from "@web/core/components/Image";
import { Pathnames } from "@web/core/constants";
import WhosInChargeRecap from "./WhosInChargeRecap";

interface Props {
  toast: Toast;
}

const OpenForContributions: FunctionComponent<Props> = ({ toast }) => {
  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={5}>
        A new TOAST has been scheduled
        <br />
        and&nbsp;
        <Text as="span" textDecoration="underline">
          we need you!
        </Text>
      </Text>

      <Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </Box>

      <Button
        as={Link}
        to={Pathnames.SUBJECTS}
        cursor="pointer"
        variant="outline"
        position="relative"
        bg="white"
        size="lg"
        colorScheme="blue"
      >
        Propose a subject for the upcoming TOAST
        <Image
          position="absolute"
          width={58}
          height={62}
          bottom="-32px"
          src="https://media.giphy.com/media/lMClXMEGuSJLZBqBh9/giphy.gif"
        />
      </Button>
    </Box>
  );
};

export default OpenForContributions;
