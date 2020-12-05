import React from 'react';
import * as C from '@chakra-ui/core';
import Link from 'next/link';

import { Toast } from '@letsshareatoast/shared';

import { Pathnames } from 'frontend/core/constants';
import { getTOASTElapsedTimeSinceCreation } from 'frontend/core/helpers/timing';

interface Props {
  toast: Toast;
}

const TOASTDateHasPassed = ({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={10}>
        Last TOAST was {getTOASTElapsedTimeSinceCreation(toast.date)}.
      </C.Text>

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

export default TOASTDateHasPassed;
