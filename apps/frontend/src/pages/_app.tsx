import React, { FunctionComponent, useEffect } from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider, CSSReset, useToast } from '@chakra-ui/core';
import { SWRConfig } from 'swr';

import 'frontend/core/styles.css';
import Header from 'frontend/header/Header';
import customTheme from 'frontend/core/theme';
import http from 'frontend/core/httpClient';
import AppLoader from 'frontend/core/components/AppLoader';
import useStores from 'frontend/core/hooks/useStores';

const LetsShareATOAST: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}) => {
  const toaster = useToast();

  const { ui, notifications } = useStores();

  useEffect(() => {
    if (process.browser && process.env.NODE_ENV === 'production') {
      console.log(
        "%cLet's share a 🍞 !",
        'padding-left: 70px; background: url(https://media.giphy.com/media/XgGwL8iUwHIOOMNwmH/giphy.gif); background-size: contain; background-repeat: no-repeat; font-size: 60px;color: black; font-weight: bold; font-style: italic; font-family: serif; text-shadow: 3px 3px 0 rgb(245,221,8)'
      );
    }
  }, []);

  // TODO: merge with all other useEffect once is resolved.
  useEffect(() => {
    // notifications.initialize(toaster);
    // Giving `toaster` as dependency will run this useEffect after each component updates.
    // This a bug I reported to Chakra UI : https://github.com/chakra-ui/chakra-ui/issues/1448
    // TODO: merge all useEffect into one once issue is resolved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ui.setWindowSize();
  }, [ui]);

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />

      <SWRConfig
        value={{
          fetcher: http(),
        }}
      >
        <AppLoader>
          <Header />

          <Component {...pageProps} />
        </AppLoader>
      </SWRConfig>
    </ChakraProvider>
  );
};

export default LetsShareATOAST;
