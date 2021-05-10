import React, { FunctionComponent, useMemo, useState } from "react";
import * as C from "@chakra-ui/react";
import { useSpring, animated, interpolate, config } from "@react-spring/web";
import dayjs from "dayjs";

import { Subject, User } from "@shared/models";

import SubjectSpeakers from "@web/subjects/components/list/item/SubjectSpeakers";
import SubjectInfoBadges from "@web/subjects/components/modals/SubjectInfoBadges";

interface Props {
  subject: Subject;
  closeModal(): void;
}

/**
 *     | min
 *     |
 *     |           <-
 *     |             |
 *     |             | Return random values between min/center and center/max.
 *     | <- center   | Randomly choose if it first pick up a value from min/center
 *     |             | or center/max.
 *     |             |
 *     |           <-
 *     |
 *     | max
 *
 * @param min
 * @param max
 * @returns [number, number]
 */
const getRandomEdgePositions = (min: number, max: number): number[] => {
  const distance = Math.abs(max - min);
  const center = distance / 2;

  const pairOfEdges =
    Math.random() > 0.5
      ? [min + Math.random() * center, min + center + Math.random() * center]
      : [min + center + Math.random() * center, min + Math.random() * center];

  return pairOfEdges.map(Math.round);
};

const ViewSubjectModal: FunctionComponent<Props> = ({
  subject,
  closeModal,
}) => {
  const [coverLoaded, setCoverLoaded] = useState(!subject.cover);

  const [
    [fromPath1, fromPath2],
    [fromPath3, fromPath4],
    [fromPath5, fromPath6],
    [fromPath7, fromPath8],
  ] = useMemo(() => {
    return [
      [Math.round(Math.random() * 30), Math.round(Math.random() * 30)],
      [Math.round(70 + Math.random() * 10), Math.round(Math.random() * 30)],
      [
        Math.round(70 + Math.random() * 30),
        Math.round(70 + Math.random() * 30),
      ],
      [Math.round(Math.random() * 30), Math.round(70 + Math.random() * 10)],
    ];
  }, []);

  const [[toPath1, toPath2], [toPath3, toPath4]] = useMemo(() => {
    return [getRandomEdgePositions(0, 5), getRandomEdgePositions(95, 100)];
  }, []);

  const { opacity, edge1, edge2, edge3, edge4 } = useSpring({
    config: config.stiff,
    from: {
      opacity: 0,
      edge1: [fromPath1, fromPath2],
      edge2: [fromPath3, fromPath4],
      edge3: [fromPath5, fromPath6],
      edge4: [fromPath7, fromPath8],
    },
    to: {
      opacity: 1,
      edge1: [0, toPath1],
      edge2: [100, toPath2],
      edge3: [100, toPath3],
      edge4: [0, toPath4],
    },
  });

  return (
    <C.Modal isOpen={true} onClose={closeModal} isCentered size="xl">
      <C.ModalOverlay>
        <C.ModalContent
          maxHeight="90vh"
          margin={0}
          bg="transparent"
          boxShadow="none"
        >
          <C.Box
            as={animated.div}
            style={{
              // @ts-ignore
              opacity,
              // @ts-ignore
              clipPath: interpolate(
                [edge1, edge2, edge3, edge4],
                (
                  [path1, path2],
                  [path3, path4],
                  [path5, path6],
                  [path7, path8]
                ) =>
                  `polygon(${path1}% ${path2}%, ${path3}% ${path4}%, ${path5}% ${path6}%, ${path7}% ${path8}%)`
              ),
            }}
            bg="white"
            position="relative"
            maxHeight="100%"
            overflowY="auto"
          >
            <C.ModalHeader p={0}>
              {subject.cover && (
                <C.Box
                  backgroundColor="gray.200"
                  position="relative"
                  transition="height 500ms"
                  overflow="hidden"
                  style={{ height: coverLoaded ? "250px" : "150px" }}
                >
                  {!coverLoaded && (
                    <C.Spinner
                      position="absolute"
                      left="50%"
                      top="50%"
                      transform="translate(-50%, -50%)"
                    />
                  )}

                  {/*
                   * Had to use native img as `onLoad` was fired twice
                   * with Chakra's Image component.
                   * */}
                  <C.Img
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
                </C.Box>
              )}

              <C.Stack p={4} pr={0} mr="50px" spacing={3}>
                {subject.cover && (
                  <C.Box>
                    <SubjectInfoBadges subject={subject} />
                  </C.Box>
                )}

                <C.Heading as="h3" fontSize="3xl" wordBreak="break-word">
                  {subject.title}
                </C.Heading>

                <C.Box fontSize="md" fontWeight="normal">
                  <SubjectSpeakers speakers={subject.speakers} />
                </C.Box>

                {!subject.cover && (
                  <C.Box>
                    <SubjectInfoBadges subject={subject} />
                  </C.Box>
                )}
              </C.Stack>
            </C.ModalHeader>

            <C.Divider m={0} />

            <C.ModalCloseButton
              d="flex"
              bg="rgba(255, 255, 255, 0.7)"
              _hover={{
                bg: "white",
              }}
              p={2}
              top={subject.cover ? "30px" : "20px"}
              borderRadius={4}
            />

            <C.ModalBody p={4}>
              <C.Text mb={8} fontSize="lg">
                {subject.description}
              </C.Text>

              {subject.comment && (
                <C.Text fontStyle="italic" fontSize="sm">
                  <C.Text as="span" fontWeight="bold">
                    Side notes:&nbsp;
                  </C.Text>
                  {subject.comment}
                </C.Text>
              )}
            </C.ModalBody>

            <C.Divider />

            <C.Box pt={4} pb={10} px={4}>
              <C.Text fontStyle="italic" fontSize="sm">
                <C.Text as="span" fontWeight="bold">
                  Created by
                </C.Text>
                {/* &nbsp;{subject.createdBy} {dayjs(subject.createdDate).fromNow()} */}
                .
              </C.Text>

              {subject.createdDate !== subject.lastModifiedDate && (
                <C.Text fontStyle="italic" fontSize="sm">
                  <C.Text as="span" fontWeight="bold">
                    Edited by
                  </C.Text>
                  {/* &nbsp;{subject.lastModifiedBy}&nbsp; */}
                  {dayjs(subject.lastModifiedDate).fromNow()}.
                </C.Text>
              )}
            </C.Box>
          </C.Box>
        </C.ModalContent>
      </C.ModalOverlay>
    </C.Modal>
  );
};

export default ViewSubjectModal;
