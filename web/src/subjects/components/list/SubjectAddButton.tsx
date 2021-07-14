import React, { FunctionComponent } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";

import Image from "@web/core/components/Image";

interface Props {
  creatingSubject: boolean;
  onClick(): void;
}

const SubjectAddButton: FunctionComponent<Props> = ({
  creatingSubject,
  onClick,
}) => {
  return (
    <Button
      d="block"
      position="relative"
      variant="outline"
      colorScheme="gray"
      borderColor="black"
      onClick={onClick}
      isDisabled={creatingSubject}
      w="100%"
      h="auto"
      p={0}
      fontWeight="bold"
      fontSize="lg"
      textTransform="uppercase"
      bg="white"
      overflow={creatingSubject ? "visible" : " hidden"}
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

      {!creatingSubject && (
        <>
          <Stack borderRadius="3px" h="100%" spacing={4} p={5}>
            <SkeletonText noOfLines={1} skeletonHeight="25px" />
            <HStack mb={10}>
              <SkeletonCircle size="28px" />
              <SkeletonText flex={1} noOfLines={1} skeletonHeight="25px" />
            </HStack>
            <Box />
            <Divider mb={3} />
          </Stack>

          <Flex
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            align="center"
            justify="center"
            bgGradient="linear(rgba(255, 255, 255, 0.7), white 80%)"
            borderRadius="3px"
          >
            <Image
              src="https://media.giphy.com/media/ZBfx0z9cMmmziSyhQl/giphy.gif"
              width={133}
              height={70}
            />
            <Text>Add your subject</Text>
          </Flex>
        </>
      )}
    </Button>
  );
};

export default SubjectAddButton;
