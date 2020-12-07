import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import * as C from '@chakra-ui/react';

import { Toast } from '@letsshareatoast/shared';

import { TOTAL_NEEDED_SUBJECTS } from 'frontend/core/constants';
import { getTOASTElapsedTimeSinceCreation } from 'frontend/core/helpers/timing';
import Image from 'frontend/core/components/Image';
import toastHasDeadheatSubjects from 'frontend/core/helpers/toastHasDeadheatSubjects';
import ProposeForNextTOASTButton from 'frontend/homepage/statuses/ProposeForNextTOASTButton';
import WhosInChargeRecap from './WhosInChargeRecap';

interface Props {
  toast: Toast;
}

const VotesClosed: FunctionComponent<Props> = observer(({ toast }) => {
  return (
    <C.Box fontWeight="bold" color="gray.800" textAlign="center">
      <C.Text fontSize="4xl" mt={0} mb={5}>
        TOAST is coming&nbsp;
        {getTOASTElapsedTimeSinceCreation(new Date(toast.date))} !
      </C.Text>

      <C.Box my={5}>
        <WhosInChargeRecap toast={toast} />
      </C.Box>

      {toastHasDeadheatSubjects(toast) && (
        <C.Box my={5}>
          <Image
            mx="auto"
            mb={3}
            width={100}
            height={100}
            src="https://media.giphy.com/media/Ve5vfhwsox2G3bJ44O/giphy.gif"
          />
          <C.Text fontSize="lg">
            Voting toast closed with more than {TOTAL_NEEDED_SUBJECTS}&nbsp;
            subjects. <br />
            Go to TOAST management below to settle this.
          </C.Text>
        </C.Box>
      )}

      {!toastHasDeadheatSubjects(toast) && (
        <C.Box mt={5}>
          <ProposeForNextTOASTButton />
        </C.Box>
      )}
    </C.Box>
  );
});

export default VotesClosed;
