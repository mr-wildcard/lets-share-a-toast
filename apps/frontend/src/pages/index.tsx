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
  const { ui, appLoading } = useStores();

  const { data: toast, revalidate: revalidateToast } = useSWR<CurrentToast>(
    APIPaths.CURRENT_TOAST
  );

  useEffect(() => {
    ui.currentPageBgColor = pageColors.homepage;

    if (toast) {
      appLoading.pageLoaded = true;
    }
  }, [ui, toast, appLoading]);

  return (
    <C.Box as="main">
      <Head>
        <title>Let&apos;s share a TOAST</title>
      </Head>

      {typeof toast !== 'undefined' && (
        <ColoredBackground d="flex" flexDirection="column" p={0}>
          <C.Flex flex={1} h="100%" direction="column">
            <C.Box m="auto">
              <TOASTStatus currentToast={toast} />
            </C.Box>

            <TOASTActions
              currentToast={toast}
              revalidateToast={revalidateToast}
            />
          </C.Flex>
        </ColoredBackground>
      )}
    </C.Box>
  );
};

export default observer(Home);
