import { FieldInputProps } from 'formik/dist/types';

import { SubjectStatus } from '@letsshareatoast/shared';

export const getStatusButtonStyleProps = (
  formField: FieldInputProps<SubjectStatus>
) => (statusValue: SubjectStatus) => {
  const isChecked = statusValue === formField.value;

  return {
    value: statusValue,
    mb: 0,
    bg: 'transparent',
    transition: 'color 200ms ease 200ms',
    style: {
      color: isChecked ? 'white' : 'black',
    },
    _hover: {
      bg: 'transparent',
    },
    _focus: {
      bg: 'transparent',
    },
  };
};
