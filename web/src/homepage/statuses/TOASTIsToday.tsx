import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { Toast } from '@shared';

import { Pathnames } from '@web/core/constants';
import WhosInChargeRecap from './WhosInChargeRecap';

interface Props {
  toast: Toast;
}

const TOASTIsToday: FunctionComponent<Props> = ({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        TOAST is today !
      </C.Text>

      <C.Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      <C.Button
        as={Link}
        to={Pathnames.SUBJECTS}
        cursor="pointer"
        variant="outline"
        bg="white"
        size="lg"
        colorScheme="blue"
      >
        Propose a subject for the next TOAST!
      </C.Button>
    </C.Box>
  );
};

export default TOASTIsToday;
