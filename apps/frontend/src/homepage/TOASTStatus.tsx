import React, { FunctionComponent, useMemo } from 'react';
import * as C from '@chakra-ui/core';
import dynamic from 'next/dynamic';

import { ToastStatus, CurrentToast } from '@letsshareatoast/shared';

import isToast from 'frontend/core/helpers/isToast';
import { hasTOASTDatePassed, isTOASTToday } from 'frontend/core/helpers/timing';

const lazyLoadConfig = {
  loading: function Loader() {
    const theme = C.useTheme();

    return (
      <C.Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor={theme.colors.gray['800']}
        color={theme.colors.orange['300']}
        size="xl"
      />
    );
  },
};

const NoTOAST = dynamic(
  () => import('./statuses/NoTOAST' /* webpackChunkName: "status-no-toast" */),
  lazyLoadConfig
);

const TOASTIsToday = dynamic(
  () =>
    import(
      './statuses/TOASTIsToday' /* webpackChunkName: "status-toast-today" */
    ),
  lazyLoadConfig
);

const TOASTDateHasPassed = dynamic(
  () =>
    import(
      './statuses/TOASTDateHasPassed' /* webpackChunkName: "status-toast-date-passed" */
    ),
  lazyLoadConfig
);

const OpenForContributions = dynamic(
  () =>
    import(
      './statuses/OpenForContributions' /* webpackChunkName: "status-open-for-contribution" */
    ),
  lazyLoadConfig
);

const OpenForVotes = dynamic(
  () =>
    import(
      './statuses/OpenForVotes' /* webpackChunkName: "status-open-for-votes" */
    ),
  lazyLoadConfig
);

const VoteClosed = dynamic(
  () =>
    import(
      './statuses/VoteClosed' /* webpackChunkName: "status-vote-closed" */
    ),
  lazyLoadConfig
);

const WaitingForTOAST = dynamic(
  () =>
    import(
      './statuses/WaitingForTOAST' /* webpackChunkName: "status-waiting-for-toast" */
    ),
  lazyLoadConfig
);

interface Props {
  currentToast: CurrentToast;
}

const TOASTStatus: FunctionComponent<Props> = ({ currentToast }) => {
  const toastIsToday = useMemo(() => {
    return isToast(currentToast) && isTOASTToday(new Date(currentToast.date));
  }, [currentToast]);

  const toastDateHasPassed = useMemo(() => {
    return (
      isToast(currentToast) && hasTOASTDatePassed(new Date(currentToast.date))
    );
  }, [currentToast]);

  return (
    <>
      {!isToast(currentToast) && <NoTOAST />}

      {isToast(currentToast) && (
        <>
          {toastDateHasPassed && <TOASTDateHasPassed toast={currentToast} />}

          {toastIsToday && <TOASTIsToday toast={currentToast} />}

          {!toastIsToday && !toastDateHasPassed && (
            <>
              {currentToast.status === ToastStatus.OPEN_TO_CONTRIBUTION && (
                <OpenForContributions toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.OPEN_FOR_VOTE && (
                <OpenForVotes toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.WAITING_FOR_TOAST && (
                <WaitingForTOAST toast={currentToast} />
              )}

              {currentToast.status === ToastStatus.VOTE_CLOSED && (
                <VoteClosed toast={currentToast} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(TOASTStatus);
