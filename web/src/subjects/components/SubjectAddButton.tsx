import React, { FC } from "react";
import {
  Box,
  Button,
  Separator,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

import Image from "@web/core/components/Image";
import { SkeletonCircle, SkeletonText } from "@web/components/ui/skeleton";

interface Props {
  creatingSubject: boolean;
  onClick(): void;
}

const SubjectAddButton: FC<Props> = ({ creatingSubject, onClick }) => {
  return (
    <Button
      display="block"
      position="relative"
      variant="outline"
      colorPalette="gray"
      borderColor="black"
      onClick={onClick}
      disabled={creatingSubject}
      w="100%"
      height="auto"
      minH="142px"
      padding={0}
      fontWeight="bold"
      fontSize="lg"
      textTransform="uppercase"
      bg="white"
      overflow={creatingSubject ? "visible" : " hidden"}
      _hover={{
        transform: "translate(-5px, -5px)",
        boxShadow: "5px 5px 0px 1px #000000",
      }}
    >
      {creatingSubject && (
        <Image
          src="https://media.giphy.com/media/2ieYd6DY1iS8y4arB2/giphy.gif"
          position="absolute"
          width={140}
          height={140}
          bottom="-30px"
        />
      )}

      <Box style={{ opacity: !creatingSubject ? 1 : 0 }}>
        <Stack borderRadius="3px" height="100%" gap={4} padding={5}>
          <SkeletonText noOfLines={1} />
          <HStack mb={10}>
            <SkeletonCircle size="28px" />
            <SkeletonText flex={1} noOfLines={1} />
          </HStack>
          <Box />
          <Separator mb={3} />
        </Stack>

        <Flex
          position="absolute"
          top={0}
          left={0}
          w="100%"
          height="100%"
          align="center"
          justify="center"
          bgGradient="linear(rgba(255, 255, 255, 0.7), white 80%)"
          borderRadius="3px"
        >
          <Image
            src="https://media.giphy.com/media/ZBfx0z9cMmmziSyhQl/giphy.gif"
            width={133}
            height={104}
          />
          <Text>Add your subject</Text>
        </Flex>
      </Box>
    </Button>
  );
};

export default SubjectAddButton;
