import React, { useEffect } from 'react';
import Head from 'next/head';
import * as C from '@chakra-ui/core';
import { observer } from 'mobx-react-lite';

import useStores from 'frontend/core/hooks/useStores';
import ColoredBackground from 'frontend/core/components/ColoredBackground';
import Image from 'frontend/core/components/Image';
import HighlightedText from 'frontend/core/components/HighlightedText';

const Custom404Page = () => {
  const theme = C.useTheme();

  const { ui, appLoading } = useStores();

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple['400'];
    appLoading.pageLoaded = true;
  }, [ui, appLoading, theme]);

  return (
    <C.Box as="main">
      <Head>
        <title>Page not found | Let&apos;s share a TOAST</title>
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
          <Image
            position="absolute"
            left={0}
            bottom="-100px"
            width={291}
            height={500}
            src="https://media.giphy.com/media/3o7aDbeo34WHHejJ2E/giphy.gif"
          />

          <Image
            width={248}
            height={248}
            src="https://media.giphy.com/media/dsWhAIVlKZJrn5VdZv/giphy.gif"
          />

          <C.Heading
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            mt={3}
          >
            <HighlightedText bgColor="black">Page not found</HighlightedText>
          </C.Heading>
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(Custom404Page);
