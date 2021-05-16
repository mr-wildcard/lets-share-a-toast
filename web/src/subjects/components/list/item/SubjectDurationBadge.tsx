import React, { FunctionComponent } from "react";
import { Badge } from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";

interface Props {
  duration: number;
}

const SubjectDurationBadge: FunctionComponent<Props> = ({ duration }) => {
  return (
    <Badge
      d="flex"
      alignItems="center"
      variant="outline"
      colorScheme="blue"
      fontWeight="bold"
    >
      <TimeIcon boxSize="10px" mr={1} />
      &nbsp;{duration} mins
    </Badge>
  );
};

export default React.memo(SubjectDurationBadge);
