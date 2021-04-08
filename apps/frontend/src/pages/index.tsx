import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import * as C from '@chakra-ui/react';
import Head from 'next/head';
import useSWR from 'swr';

import { CurrentToast } from '@letsshareatoast/shared';

import { APIPaths, pageColors } from 'frontend/core/constants';
import useStores from 'frontend/core/hooks/useStores';
import TOASTActions from 'frontend/homepage/TOASTActions';
import TOASTStatus from 'frontend/homepage/TOASTStatus';
import ColoredBackground from 'frontend/core/components/ColoredBackground';

const Home = () => {
  const { ui, appLoader, currentToastSession } = useStores();

  useEffect(() => {
    ui.currentPageBgColor = pageColors.homepage;
    appLoader.pageIsReady = currentToastSession.isLoaded;
  }, []);

  return (
    <C.Box as="main">
      <Head>
        <title>Let&apos;s share a TOAST</title>
      </Head>

      {currentToastSession.isLoaded && (
        <ColoredBackground d="flex" flexDirection="column" p={0}>
          <C.Flex flex={1} h="100%" direction="column">
            <C.Box m="auto">
              <TOASTStatus currentToast={currentToastSession.toast} />
            </C.Box>

            <TOASTActions currentToast={currentToastSession.toast} />
          </C.Flex>
        </ColoredBackground>
      )}
    </C.Box>
  );
};

export default observer(Home);
