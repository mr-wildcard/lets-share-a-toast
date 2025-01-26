import React, { FC } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { NavbarElementProps } from "react-day-picker";

const DatePickerNavBar: FC<NavbarElementProps> = ({
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <ButtonGroup attached>
      <Button
        borderRadius={0}
        roundedTopLeft="3px"
        flex={1}
        disabled={!showPreviousButton}
        onClick={() => onPreviousClick()}
      >
        <LuArrowLeft /> Previous month
      </Button>
      <Button
        borderRadius={0}
        borderTopRightRadius="3px"
        flex={1}
        disabled={!showNextButton}
        onClick={() => onNextClick()}
      >
        Next month <LuArrowRight />
      </Button>
    </ButtonGroup>
  );
};

export default DatePickerNavBar;
