import React from 'react';
import * as C from '@chakra-ui/react';
import Link from 'next/link';

import { Toast } from '@letsshareatoast/shared';

import { Pathnames } from 'frontend/core/constants';
import WhosInChargeRecap from './WhosInChargeRecap';

interface Props {
  toast: Toast;
}

const TOASTIsToday = ({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        TOAST is today !
      </C.Text>

      <C.Box mb={10}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      <Link href={Pathnames.SUBJECTS}>
        <C.Button
          as="a"
          cursor="pointer"
          variant="outline"
          bg="white"
          size="lg"
          colorScheme="blue"
        >
          Propose a subject for the next TOAST!
        </C.Button>
      </Link>
    </C.Box>
  );
};

export default TOASTIsToday;
