import React from "react";
import { Input, Group, InputAddon } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

class DateInput extends React.PureComponent {
  static displayName = "DateInput";

  public render() {
    return (
      <Group attached>
        <InputAddon>
          <CalendarIcon color="gray.300" />
        </InputAddon>
        <Input cursor="pointer" readOnly id="dueDate" {...this.props} />;
      </Group>
    );
  }
}

export default DateInput;
