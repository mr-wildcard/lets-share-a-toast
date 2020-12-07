import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import * as C from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import useSWR from 'swr';

import { Toast, ToastStatus } from '@letsshareatoast/shared';

import { APIPaths, pageColors } from 'frontend/core/constants';
import useStores from 'frontend/core/hooks/useStores';
import isToast from 'frontend/core/helpers/isToast';
import ColoredBackground from 'frontend/core/components/ColoredBackground';
import { LoadingErrorCode } from 'frontend/votes/types';
import LoadingError from 'frontend/votes/components/LoadingError';

const VotingSession = () => {
  const { voting, ui, appLoading } = useStores();

  const { data: currentToast } = useSWR<Toast>(APIPaths.CURRENT_TOAST);

  const [loadingError, setLoadingError] = useState<null | LoadingErrorCode>(
    null
  );

  const initializeVotingSession = useCallback(() => {
    return voting.initialize(currentToast);
  }, [currentToast, voting]);

  useEffect(() => {
    ui.currentPageBgColor = pageColors.votingSession;
    appLoading.pageLoaded = true;
  }, [appLoading, ui]);

  useEffect(() => {
    if (isToast(currentToast)) {
      if (currentToast.status === ToastStatus.OPEN_FOR_VOTE) {
        initializeVotingSession().catch((error) => {
          console.error('Error while initiatizing voting toast.', {
            error,
          });
        });
      } else {
        setLoadingError(LoadingErrorCode.WRONG_SESSION_STATUS);
      }
    } else {
      setLoadingError(LoadingErrorCode.NO_SESSION);
    }
  }, [currentToast, voting, initializeVotingSession]);

  return (
    <C.Box as="main">
      <Head>
        <title>Voting session | Let&apos;s share a TOAST</title>
      </Head>

      <ColoredBackground>
        <C.Flex direction="column">
          {!voting.initialized && (
            <>
              {loadingError === null && 'Chargement en cours...'}
              {loadingError !== null && <LoadingError error={loadingError} />}
            </>
          )}

          {voting.initialized && (
            <pre>
              <code>{JSON.stringify(voting.session, null, 3)}</code>
            </pre>
          )}
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(VotingSession);
