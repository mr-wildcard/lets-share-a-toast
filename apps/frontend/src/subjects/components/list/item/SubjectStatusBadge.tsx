import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import { SubjectStatus } from '@letsshareatoast/shared';

interface Props {
  status: SubjectStatus;
}

const SubjectStatusBadge: FunctionComponent<Props> = ({ status }) => (
  <>
    {status === SubjectStatus.AVAILABLE && (
      <C.Badge
        variant="solid"
        colorScheme="green"
        title="Available for a TOAST"
      >
        Available
      </C.Badge>
    )}

    {status === SubjectStatus.UNAVAILABLE && (
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
