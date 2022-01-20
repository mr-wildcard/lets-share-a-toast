import React, { FunctionComponent } from "react";
import { Box, Text, useToken } from "@chakra-ui/react";

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
  const [green500, gray50, gray300] = useToken("colors", [
    "green.500",
    "gray.50",
    "gray.300",
  ]);

  return (
    <Box
      p={4}
      as="button"
      type="button"
      position="relative"
      disabled={!onClick}
      w="full"
      borderRadius="8px"
      borderWidth="3px"
      borderStyle="solid"
      _hover={{
        bgColor: selected ? "green.500" : "gray.100",
      }}
      onClick={onClick}
      textAlign="left"
      style={{
        color: selected ? "white" : "black",
        backgroundColor: selected ? green500 : gray50,
        borderColor: selected ? "transparent" : gray300,
      }}
    >
      <Text fontWeight="bold" fontStyle="italic">
        &quot;{subject.title}&quot;
      </Text>
      <Text as="span" fontSize="sm">
        Presented by:&nbsp;
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
