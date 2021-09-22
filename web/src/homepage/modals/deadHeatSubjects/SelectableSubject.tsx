import React, { FunctionComponent } from "react";
import { Box, Text } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import { getSubjectSpeakersAsText } from "@web/core/helpers/getSubjectSpeakersAsText";

interface Props {
  subject: Subject;
  selected: boolean;
  totalVotes: number;
  onClick?(): void;
}

const SelectableSubject: FunctionComponent<Props> = ({
  subject,
  selected,
  totalVotes,

  onClick,
}) => {
  return (
    <Box
      p={4}
      as="button"
      type="button"
      position="relative"
      disabled={!onClick}
      color={selected ? "white" : "black"}
      w="full"
      borderRadius="8px"
      bgColor={selected ? "green.500" : "gray.50"}
      borderWidth="3px"
      borderStyle="solid"
      borderColor={selected ? "transparent" : "gray.300"}
      _hover={{
        bgColor: selected ? "green.500" : "gray.100",
      }}
      onClick={onClick}
      textAlign="left"
    >
      <Text fontWeight="bold" fontStyle="italic">
        &quot;{subject.title}&quot;
      </Text>
      <Text as="span" fontSize="sm">
        Presented by:{" "}
        <Text as="span" fontWeight="bold">
          {getSubjectSpeakersAsText(subject.speakers)}
        </Text>
      </Text>
      <Text fontSize="sm">
        Total votes:{" "}
        <Text as="span" fontWeight="bold">
          {totalVotes}
        </Text>
      </Text>
    </Box>
  );
};

export { SelectableSubject };
