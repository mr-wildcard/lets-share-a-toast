import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { SubjectStatus } from '@letsshareatoast/shared';

interface Props {
  status: SubjectStatus;
}

const SubjectStatusBadge: FunctionComponent<Props> = ({ status }) => (
  <>
    {status === SubjectStatus.AVAILABLE && (
      <C.Badge variant="solid" colorScheme="green">
        Available for a TOAST
      </C.Badge>
    )}

    {status === SubjectStatus.NOT_AVAILABLE && (
      <C.Badge variant="solid" colorScheme="red">
        Unavailable
      </C.Badge>
    )}

    {status === SubjectStatus.DONE && (
      <C.Badge variant="solid">Already given</C.Badge>
    )}
  </>
);

export default SubjectStatusBadge;
