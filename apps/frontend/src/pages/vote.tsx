import React, { useEffect, useState } from 'react';
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
import LoadingError from 'frontend/votes/LoadingError';

const VotingSession = () => {
  const {
    currentToastSession: { toast },
    voting,
    ui,
    appLoader,
    auth,
  } = useStores();

  const [loadingError, setLoadingError] = useState<null | LoadingErrorCode>(
    null
  );

  useEffect(() => {
    ui.currentPageBgColor = pageColors.votingSession;
    appLoader.pageIsReady = true;
  }, []);

  useEffect(() => {
    if (isToast(toast)) {
      if (toast.status === ToastStatus.OPEN_FOR_VOTE) {
        setLoadingError(null);

        voting.initialize().catch((error) => {
          setLoadingError(LoadingErrorCode.UNKNOWN_ERROR);

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
  }, [toast, voting]);

  useEffect(() => {
    let listenToVotesHandler;

    if (voting.initialized) {
      listenToVotesHandler = voting.listenToVotes(toast.id);
    }

    return () => {
      if (typeof listenToVotesHandler === 'function') {
        listenToVotesHandler();
      }
    };
  }, [voting.initialized]);

  return (
    <C.Box as="main">
      <Head>
        <title>Voting session | Let&apos;s share a TOAST</title>
      </Head>

      <ColoredBackground>
        <C.Flex direction="column">
          {(!voting.initialized || !voting.session) && (
            <>
              {loadingError === null && 'Chargement en cours...'}
              {loadingError !== null && <LoadingError error={loadingError} />}
            </>
          )}

          {voting.initialized && !!voting.session && (
            <C.Box>
              <C.Box>
                {Object.keys(voting.session.votes).map((subjectId) => {
                  return (
                    <C.Button
                      key={subjectId}
                      m={3}
                      onClick={() =>
                        voting.toggleVote({
                          currentToastId: toast.id,
                          userId: 'john-doe',
                          // auth.profile.id,
                          subjectId: subjectId,
                        })
                      }
                    >
                      {subjectId}
                    </C.Button>
                  );
                })}
              </C.Box>
              <pre>
                <code>{JSON.stringify(voting.session, null, 3)}</code>
              </pre>
            </C.Box>
          )}
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(VotingSession);
