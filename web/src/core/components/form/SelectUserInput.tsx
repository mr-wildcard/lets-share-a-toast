import React, { FunctionComponent } from "react";
import * as C from "@chakra-ui/react";
import Select, { Props as SelectProps } from "react-select";

import { FirestoreUser } from "@shared/firebase/firestore/models/FirestoreUser";

import getUserFullname from "@web/core/helpers/getUserFullname";

interface Props extends SelectProps<FirestoreUser> {
  isInvalid: boolean;
}

const SelectUserInput: FunctionComponent<Props> = ({
  placeholder = "Pick up someone...",
  isInvalid,
  ...props
}) => {
  const { space, colors } = C.useTheme();

  return (
    <Select
      {...props}
      placeholder={placeholder}
      isMulti={false}
      isSearchable={true}
      noOptionsMessage={() => "No user found."}
      getOptionValue={(user: FirestoreUser) => user.uid}
      getOptionLabel={(user: FirestoreUser) => getUserFullname(user)}
      formatOptionLabel={(user: FirestoreUser) => (
        <C.Stack align="center" spacing={2} direction="row">
          <C.Avatar
            size="xs"
            name={getUserFullname(user)}
            src={user.photoURL || undefined}
          />
          <C.Text as="span">{getUserFullname(user)}</C.Text>
        </C.Stack>
      )}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,

          /**
           * space['10'] = 2.5em following Chakra's theme value.
           * Needed in subject form to have the same height
           * as the button '-' next to it.
           */
          height: space["10"],
          borderColor: isInvalid ? colors.red["600"] : baseStyles.borderColor,
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: isInvalid ? colors.red["500"] : baseStyles.color,
        }),
      }}
    />
  );
};

export default SelectUserInput;
