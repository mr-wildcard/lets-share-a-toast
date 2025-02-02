import React, { FC } from "react";
import { Badge, Box } from "@chakra-ui/react";
import { LuTimer } from "react-icons/lu";

interface Props {
  duration: number;
}

const SubjectDurationBadge: FC<Props> = ({ duration }) => {
  return (
    <Badge
      display="flex"
      alignItems="center"
      variant="outline"
      colorPalette="blue"
      fontWeight="bold"
    >
      <Box boxSize="10px" mr={1}>
        <LuTimer />
      </Box>
      &nbsp;{duration} mins
    </Badge>
  );
};

export default React.memo(SubjectDurationBadge);
