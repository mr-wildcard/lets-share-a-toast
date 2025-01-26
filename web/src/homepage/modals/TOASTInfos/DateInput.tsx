import React from "react";
import { Input, Group, InputAddon } from "@chakra-ui/react";
import { LuCalendarDays } from "react-icons/lu";

class DateInput extends React.PureComponent {
  static displayName = "DateInput";

  public render() {
    return (
      <Group attached>
        <InputAddon>
          <LuCalendarDays color="gray.300" />
        </InputAddon>
        <Input cursor="pointer" readOnly id="dueDate" {...this.props} />;
      </Group>
    );
  }
}

export default DateInput;
