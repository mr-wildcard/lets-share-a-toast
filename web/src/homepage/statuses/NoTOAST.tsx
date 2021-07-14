import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Pathnames } from "@web/core/constants";
import Image from "@web/core/components/Image";

const NoTOAST = () => {
  return (
    <Box fontWeight="bold" color="gray.800" textAlign="center">
      <Text fontSize="4xl" mt={0} mb={10}>
        No scheduled TOAST yet.
      </Text>
      <Button
        as={Link}
        to={Pathnames.SUBJECTS}
        variant="outline"
        cursor="pointer"
        position="relative"
        bg="white"
        size="lg"
        colorScheme="blue"
        pr="70px"
      >
        Propose a subject for the next TOAST
        <Image
          position="absolute"
          transform="translateY(-4px)"
          width={98}
          height={45}
          right="-30px"
          top={0}
          src="https://media.giphy.com/media/3og0IARm07OVhdM8a4/giphy.webp"
        />
      </Button>
    </Box>
  );
};

export default NoTOAST;
