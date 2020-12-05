import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import Image from 'frontend/core/components/Image';

const SubjectNewBadge: FunctionComponent = () => {
  return (
    <C.Badge variant="outline" colorScheme="red" position="relative" pl="30px">
      <Image
        position="absolute"
        src="https://media.giphy.com/media/KZXnlnHy0Bx33ecYcJ/giphy.gif"
        width={40}
        height={40}
        bottom="-2px"
        left="-6px"
      />
      New !
    </C.Badge>
  );
};

export default React.memo(SubjectNewBadge);
