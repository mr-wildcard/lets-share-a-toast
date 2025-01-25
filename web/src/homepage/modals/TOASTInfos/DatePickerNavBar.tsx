import React, { FC } from "react";
import { Button, Group } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { NavbarElementProps } from "react-day-picker";

const DatePickerNavBar: FC<NavbarElementProps> = ({
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <Group attached gap={0}>
      <Button
        borderRadius={0}
        roundedTopLeft="3px"
        flex={1}
        disabled={!showPreviousButton}
        onClick={() => onPreviousClick()}
      >
        <ArrowBackIcon /> Previous month
      </Button>
      <Button
        borderRadius={0}
        borderTopRightRadius="3px"
        flex={1}
        disabled={!showNextButton}
        onClick={() => onNextClick()}
      >
        Next month <ArrowForwardIcon />
      </Button>
    </Group>
  );
};

export default DatePickerNavBar;
