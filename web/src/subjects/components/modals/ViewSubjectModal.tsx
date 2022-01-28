import React, { FunctionComponent, useState } from "react";
import {
  Box,
  Divider,
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

import { Subject } from "@shared/models";

import SubjectSpeakers from "@web/subjects/components/item/SubjectSpeakers";
import SubjectInfoBadges from "@web/subjects/components/modals/SubjectInfoBadges";
import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props {
  subject: Subject;
  closeModal(): void;
}

const ViewSubjectModal: FunctionComponent<Props> = ({
  subject,
  closeModal,
}) => {
  const [coverLoaded, setCoverLoaded] = useState(!subject.cover);

  return (
    <Modal
      isOpen={true}
      onClose={closeModal}
      isCentered={true}
      motionPreset="slideInBottom"
      size="xl"
    >
      <ModalOverlay>
        <ModalContent
          maxHeight="90vh"
          margin={0}
          bg="transparent"
          boxShadow="none"
        >
          <Box bg="white" position="relative" maxHeight="100%" overflowY="auto">
            <ModalHeader p={0}>
              {subject.cover && (
                <Box
                  backgroundColor="gray.200"
                  position="relative"
                  transition="height 500ms"
                  overflow="hidden"
                  style={{ height: coverLoaded ? "250px" : "150px" }}
                >
                  {!coverLoaded && (
                    <Spinner
                      position="absolute"
                      left="50%"
                      top="50%"
                      transform="translate(-50%, -50%)"
                    />
                  )}

                  <Img
                    src={subject.cover}
                    transition="opacity 500ms"
                    style={{
                      opacity: coverLoaded ? 1 : 0,
                    }}
                    onLoad={() => {
                      setCoverLoaded(true);
                    }}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    objectPosition="center"
                  />
                </Box>
              )}

              <Stack p={4} pr={0} mr="50px" spacing={3}>
                {subject.cover && (
                  <Box>
                    <SubjectInfoBadges subject={subject} />
                  </Box>
                )}

                <Heading as="h3" fontSize="3xl" wordBreak="break-word">
                  {subject.title}
                </Heading>

                <Box fontSize="md" fontWeight="normal">
                  <SubjectSpeakers speakers={subject.speakers} />
                </Box>

                {!subject.cover && (
                  <Box>
                    <SubjectInfoBadges subject={subject} />
                  </Box>
                )}
              </Stack>
            </ModalHeader>

            <Divider m={0} />

            <ModalCloseButton
              d="flex"
              bg="rgba(255, 255, 255, 0.7)"
              p={2}
              _hover={{
                bg: "white",
              }}
              top={subject.cover ? "30px" : "20px"}
              borderRadius={4}
            />

            <ModalBody p={4}>
              <Text mb={8} fontSize="lg">
                {subject.description}
              </Text>

              {subject.comment && (
                <Text fontStyle="italic" fontSize="sm">
                  <Text as="span" fontWeight="bold">
                    Side notes:&nbsp;
                  </Text>
                  {subject.comment}
                </Text>
              )}
            </ModalBody>

            <Divider />

            <Box pt={4} pb={10} px={4}>
              <Text fontStyle="italic" fontSize="sm">
                Created by&nbsp;{getUserFullname(subject.createdByUser)}&nbsp;
                {dayjs(subject.createdDate).fromNow()}.
              </Text>

              {subject.createdDate !== subject.lastModifiedDate && (
                <Text fontStyle="italic" fontSize="sm">
                  Edited by&nbsp;{getUserFullname(subject.lastModifiedByUser)}
                  &nbsp;{dayjs(subject.lastModifiedDate).fromNow()}.
                </Text>
              )}
            </Box>
          </Box>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ViewSubjectModal;
