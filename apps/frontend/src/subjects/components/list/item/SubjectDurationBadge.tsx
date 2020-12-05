import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';
import { TimeIcon } from '@chakra-ui/icons';

interface Props {
  duration: number;
}

const SubjectDurationBadge: FunctionComponent<Props> = ({ duration }) => {
  return (
    <C.Badge
      d="flex"
      alignItems="center"
      variant="outline"
      colorScheme="blue"
      fontWeight="bold"
    >
      <TimeIcon boxSize="10px" mr={1} />
      &nbsp;{duration} mins
    </C.Badge>
  );
};

export default React.memo(SubjectDurationBadge);
