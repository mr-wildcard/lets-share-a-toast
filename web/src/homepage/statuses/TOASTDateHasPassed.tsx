import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { Toast } from '@shared';

import { Pathnames } from '@web/core/constants';
import { getTOASTElapsedTimeSinceCreation } from '@web/core/helpers/timing';

interface Props {
  toast: Toast;
}

const TOASTDateHasPassed: FunctionComponent<Props> = ({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={10}>
        Last TOAST was {getTOASTElapsedTimeSinceCreation(new Date(toast.date))}.
      </C.Text>

      <C.Button
        to={Pathnames.SUBJECTS}
        as={Link}
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

export default TOASTDateHasPassed;
