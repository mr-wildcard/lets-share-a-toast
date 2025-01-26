import React, { FC } from "react";
import { Box, Button, Text, useToken } from "@chakra-ui/react";

import { Subject } from "@shared/models";

import { getSubjectSpeakersAsText } from "@web/core/helpers/getSubjectSpeakersAsText";

interface Props {
  subject: Subject;
  selected: boolean;
  totalVotes: number;
  onClick?(): void;
}

const SelectableSubject: FC<Props> = ({
  subject,
  selected,
  totalVotes,
  onClick,
}) => {
  const [gray50, gray100, gray300, green500] = useToken("colors", [
    "gray.50",
    "gray.100",
    "gray.300",
    "green.500",
  ]);

  return (
    <Button
      padding={4}
      position="relative"
      disabled={!onClick}
      w="full"
      borderRadius="8px"
      borderWidth="3px"
      borderStyle="solid"
      _hover={{
        bgColor: selected ? green500 : gray100,
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
    </Button>
  );
};

export { SelectableSubject };
