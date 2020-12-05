import React, { useEffect, useMemo } from 'react';
import { ErrorProps } from 'next/error';
import { NextPage } from 'next';
import Head from 'next/head';
import * as C from '@chakra-ui/core';

import ColoredBackground from 'frontend/core/components/ColoredBackground';
import useStores from 'frontend/core/hooks/useStores';
import Image from 'frontend/core/components/Image';
import HighlightedText from 'frontend/core/components/HighlightedText';

const errorIllustrations = [
  {
    width: 300,
    height: 242,
    src: 'https://media.giphy.com/media/dphDDCpGfzJPq/giphy.gif',
  },
  {
    width: 301,
    height: 300,
    src: 'https://media.giphy.com/media/kag03aW6qmohqz538Q/giphy.gif',
  },
];

const Error: NextPage<ErrorProps> = () => {
  const theme = C.useTheme();

  const { ui, appLoading } = useStores();

  const illustration = useMemo(() => {
    return errorIllustrations[
      Math.floor(Math.random() * errorIllustrations.length)
    ];
  }, []);

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple['400'];
    appLoading.pageLoaded = true;
  }, [ui, appLoading, theme]);

  return (
    <C.Box as="main">
      <Head>
        <title>Something&apos;s broken | Let&apos;s share a TOAST</title>
      </Head>
      <ColoredBackground d="flex" p={0}>
        <C.Flex
          flex={1}
          position="relative"
          direction="column"
          justify="center"
          align="center"
          overflow="hidden"
        >
          <Image {...illustration} />

          <C.Heading
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            mt={3}
          >
            <HighlightedText bgColor="black">
              Oops. The page exploded before rendering.
            </HighlightedText>
          </C.Heading>
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

Error.getInitialProps = ({ res, err }) => {
  return { statusCode: res?.statusCode ?? err?.statusCode ?? 404 };
};

export default Error;
