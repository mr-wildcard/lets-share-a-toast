import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/core';

import { Toast } from '@letsshareatoast/shared';

import { getTOASTElapsedTimeSinceCreation } from 'frontend/core/helpers/timing';
import WhosInChargeRecap from './WhosInChargeRecap';
import ProposeForNextTOASTButton from './ProposeForNextTOASTButton';
import SelectedSubjectsList from './SelectedSubjectsList';
import FloralSeparator from './FloralSeparator';

interface Props {
  toast: Toast;
}

const WaitingForTOAST: FunctionComponent<Props> = observer(({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        TOAST is coming&nbsp;
        {getTOASTElapsedTimeSinceCreation(new Date(toast.date))} !
      </C.Text>

      <C.Box my={5}>
        <WhosInChargeRecap toast={toast} />
        <C.Text fontSize="lg">
          We&apos;ll have the pleasure to attend to the following talks:
        </C.Text>
      </C.Box>

      <C.Flex align="center" direction="column">
        <SelectedSubjectsList toast={toast} />
      </C.Flex>

      <C.Flex my={5} justify="center">
        <FloralSeparator />
      </C.Flex>

      <C.Text mb={3} fontSize="lg">
        In the meantime, you can still...
      </C.Text>
      <ProposeForNextTOASTButton />
    </C.Box>
  );
});

export default WaitingForTOAST;
