import React, { FunctionComponent } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Toast } from "@shared/models";

import { Pathnames } from "@web/core/constants";
import WhosInChargeRecap from "@web/homepage/statuses/components/WhosInChargeRecap";

interface Props {
  toast: Toast;
}

const TOASTIsToday: FunctionComponent<Props> = ({ toast }) => {
  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={5}>
        TOAST is today !
      </Text>

      <Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </Box>

      <Button
        as={Link}
        to={Pathnames.SUBJECTS}
        cursor="pointer"
        variant="outline"
        bg="white"
        size="lg"
        colorScheme="blue"
      >
        Propose a subject for the next TOAST!
      </Button>
    </Box>
  );
};

export default TOASTIsToday;
