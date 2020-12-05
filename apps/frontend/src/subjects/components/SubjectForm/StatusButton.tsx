import React from 'react';
import * as C from '@chakra-ui/core';

const StatusButton = (props, ref) => {
  const { isChecked, children, ...rest } = props;

  return (
    <C.Button
      {...rest}
      ref={ref}
      mb={0}
      aria-checked={isChecked}
      role="radio"
      transition="color 200ms ease 200ms"
      variant="outline"
      style={{
        color: isChecked ? 'white' : 'black',
      }}
      _hover={{
        bg: 'transparent',
      }}
      _focus={{
        bg: 'transparent',
      }}
      bg="transparent"
    >
      {children}
    </C.Button>
  );
};

export default React.forwardRef<HTMLButtonElement, C.RadioProps>(StatusButton);
