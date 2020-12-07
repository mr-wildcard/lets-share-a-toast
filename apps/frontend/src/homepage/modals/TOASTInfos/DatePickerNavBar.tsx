import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { NavbarElementProps } from 'react-day-picker';

const DatePickerNavBar: FunctionComponent<NavbarElementProps> = ({
  showPreviousButton,
  showNextButton,
  onPreviousClick,
  onNextClick,
}) => {
  return (
    <C.ButtonGroup d="flex" isAttached size="md" spacing={0}>
      <C.Button
        borderRadius={0}
        roundedTopLeft="3px"
        flex={1}
        isDisabled={!showPreviousButton}
        onClick={() => onPreviousClick()}
        leftIcon={<ArrowBackIcon />}
      >
        Previous month
      </C.Button>
      <C.Button
        borderRadius={0}
        borderTopRightRadius="3px"
        flex={1}
        isDisabled={!showNextButton}
        onClick={() => onNextClick()}
        rightIcon={<ArrowForwardIcon />}
      >
        Next month
      </C.Button>
    </C.ButtonGroup>
  );
};

export default DatePickerNavBar;
