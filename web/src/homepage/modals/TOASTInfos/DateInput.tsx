import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

class DateInput extends React.PureComponent {
  static displayName = "DateInput";

  public render() {
    return (
      <InputGroup>
        <InputLeftElement>
          <CalendarIcon color="gray.300" />
        </InputLeftElement>
        <Input cursor="pointer" isReadOnly id="dueDate" {...this.props} />;
      </InputGroup>
    );
  }
}

export default DateInput;
