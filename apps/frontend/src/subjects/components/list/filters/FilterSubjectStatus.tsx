import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import * as C from '@chakra-ui/react';

import { SubjectStatus } from '@letsshareatoast/shared';

import { StatusFilterValue } from 'frontend/subjects/types';

const sortedStatusValues: string[] = [
  'all',
  SubjectStatus.AVAILABLE,
  SubjectStatus.UNAVAILABLE,
  SubjectStatus.DONE,
];

const sortedStatusLabels: { [value in StatusFilterValue]: string } = {
  all: 'all subjects',
  [SubjectStatus.AVAILABLE]: 'all available subjects',
  [SubjectStatus.UNAVAILABLE]: 'all unavailable subjects',
  [SubjectStatus.DONE]: 'all given talks',
};

interface Props {
  onStatusChanged(status: StatusFilterValue): void;
}

const FilterSubjectStatus: FunctionComponent<Props> = ({ onStatusChanged }) => {
  const [statusIndex, setStatusIndex] = useState(0);

  const { currentStatusValue, currentStatusLabel } = useMemo(() => {
    const currentStatusValue = sortedStatusValues[statusIndex];

    return {
      currentStatusValue,
      currentStatusLabel: sortedStatusLabels[currentStatusValue],
    };
  }, [statusIndex]);

  useEffect(() => {
    onStatusChanged(currentStatusValue as StatusFilterValue);
  }, [statusIndex, onStatusChanged, currentStatusValue]);

  const flash = useSpring({
    reset: true,
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  });

  return (
    <C.Button
      onClick={() => {
        if (statusIndex + 1 >= sortedStatusValues.length) {
          setStatusIndex(0);
        } else {
          setStatusIndex(statusIndex + 1);
        }
      }}
      color="gray.800"
      fontSize="inherit"
      textDecoration="underline"
      variant="link"
    >
      <C.Text
        as={animated.span}
        // @ts-ignore
        style={flash}
      >
        {currentStatusLabel}
      </C.Text>
    </C.Button>
  );
};

export default React.memo(FilterSubjectStatus);
