import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Button, Text } from "@chakra-ui/react";

import { SubjectStatus } from "@shared/enums";

import { StatusFilterValue } from "@web/subjects/types";

const sortedStatusValues: StatusFilterValue[] = [
  "all",
  SubjectStatus.AVAILABLE,
  SubjectStatus.UNAVAILABLE,
  SubjectStatus.DONE,
];

type SortedStatusLabels = {
  [value in StatusFilterValue]: string;
};

const sortedStatusLabels: SortedStatusLabels = {
  all: "all subjects",
  [SubjectStatus.AVAILABLE]: "all available subjects",
  [SubjectStatus.UNAVAILABLE]: "all unavailable subjects",
  [SubjectStatus.DONE]: "all given talks",
};

interface Props {
  onStatusChanged(status: StatusFilterValue): void;
}

const FilterSubjectStatus: FunctionComponent<Props> = ({ onStatusChanged }) => {
  const [statusIndex, setStatusIndex] = useState(0);

  const { currentStatusValue, currentStatusLabel } = useMemo(() => {
    const currentStatusValue: StatusFilterValue =
      sortedStatusValues[statusIndex];

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
    <Button
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
      <Text
        as={animated.span}
        // @ts-ignore
        style={flash}
      >
        {currentStatusLabel}
      </Text>
    </Button>
  );
};

export default React.memo(FilterSubjectStatus);
