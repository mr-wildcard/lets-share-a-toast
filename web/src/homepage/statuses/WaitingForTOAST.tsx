import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import { Toast } from '@shared';

import { getTOASTElapsedTimeSinceCreation } from '@web/core/helpers/timing';
import WhosInChargeRecap from './WhosInChargeRecap';
import ProposeSubjectForNextTOASTButton from './ProposeSubjectForNextTOASTButton';
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
      </C.Box>

      <C.Flex my={5} justify="center">
        <FloralSeparator />
      </C.Flex>

      <C.Text fontSize="lg" mb={3}>
        We&apos;ll have the pleasure to attend to the following talks:
      </C.Text>

      <C.Flex align="center" direction="column">
        <SelectedSubjectsList currentToast={toast} />
      </C.Flex>

      <C.Flex my={5} justify="center">
        <FloralSeparator />
      </C.Flex>

      <C.Text mb={3} fontSize="lg">
        In the meantime, you can still...
      </C.Text>

      <ProposeSubjectForNextTOASTButton />
    </C.Box>
  );
});

export default WaitingForTOAST;
