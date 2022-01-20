import React, { FunctionComponent } from "react";
import Select, { Props as SelectProps } from "react-select";
import { Avatar, Stack, Text, useToken } from "@chakra-ui/react";

import { User } from "@shared/models";

import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props extends SelectProps<User> {
  isInvalid: boolean;
}

const SelectUserInput: FunctionComponent<Props> = ({
  placeholder = "Pick up someone...",
  isInvalid,
  ...props
}) => {
  const [red500, red600] = useToken("colors", ["red.500", "red.600"]);
  const [space10] = useToken("space", [10]);

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isMulti={false}
      isSearchable={true}
      noOptionsMessage={() => "No user found."}
      getOptionValue={(user: User) => user.id}
      getOptionLabel={(user: User) => getUserFullname(user)}
      formatOptionLabel={(user: User) => (
        <Stack align="center" spacing={2} direction="row">
          <Avatar
            size="xs"
            name={getUserFullname(user)}
            src={user.photoURL || undefined}
          />
          <Text as="span">{getUserFullname(user)}</Text>
        </Stack>
      )}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,

          /**
           * space['10'] = 2.5em following Chakra's theme value.
           * Needed in subject form to have the same height
           * as the button '-' next to it.
           */
          height: space10,
          borderColor: isInvalid ? red600 : baseStyles.borderColor,
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: isInvalid ? red500 : baseStyles.color,
        }),
      }}
    />
  );
};

export default SelectUserInput;
