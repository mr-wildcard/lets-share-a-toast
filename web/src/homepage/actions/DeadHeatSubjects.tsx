import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import Image from '@web/core/components/Image';
import css from './DeadHeatSubjects.module.css';

interface Props {
  onClick: () => void;
}

const DeadHeatSubjects: FunctionComponent<Props> = ({ onClick }) => {
  return (
    <C.Button
      className={css.button}
      onClick={onClick}
      variant="outline"
      position="relative"
      bg="white"
      size="lg"
      colorScheme="red"
      fontWeight="bold"
    >
      Settle subjects
      <Image
        position="absolute"
        width={50}
        height={50}
        top="-20px"
        right="-20px"
        style={{
          filter: 'invert(1)',
        }}
        src="https://media.giphy.com/media/XdUcEiOP7M3n99Rj4L/giphy.gif"
      />
    </C.Button>
  );
};

export default React.memo(DeadHeatSubjects);
