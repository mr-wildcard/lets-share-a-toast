import React from 'react';
import * as C from '@chakra-ui/core';
import { CalendarIcon } from '@chakra-ui/icons';

class DateInput extends React.PureComponent {
  static displayName = 'DateInput';

  public render() {
    return (
      <C.InputGroup>
        <C.InputLeftElement>
          <CalendarIcon color="gray.300" />
        </C.InputLeftElement>
        <C.Input cursor="pointer" isReadOnly id="dueDate" {...this.props} />;
      </C.InputGroup>
    );
  }
}

export default DateInput;
