import React, { FunctionComponent } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { NavbarElementProps } from "react-day-picker";

const DatePickerNavBar: FunctionComponent<NavbarElementProps> = ({
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <ButtonGroup d="flex" isAttached size="md" spacing={0}>
      <Button
        borderRadius={0}
        roundedTopLeft="3px"
        flex={1}
        isDisabled={!showPreviousButton}
        onClick={() => onPreviousClick()}
        leftIcon={<ArrowBackIcon />}
      >
        Previous month
      </Button>
      <Button
        borderRadius={0}
        borderTopRightRadius="3px"
        flex={1}
        isDisabled={!showNextButton}
        onClick={() => onNextClick()}
        rightIcon={<ArrowForwardIcon />}
      >
        Next month
      </Button>
    </ButtonGroup>
  );
};

export default DatePickerNavBar;
