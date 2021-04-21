import React, { useEffect } from 'react';
import * as C from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

import useStores from '@web/core/hooks/useStores';
import ColoredBackground from '@web/core/components/ColoredBackground';
import Image from '@web/core/components/Image';
import HighlightedText from '@web/core/components/HighlightedText';

const Custom404Page = () => {
  const theme = C.useTheme();

  const { ui, appLoader } = useStores();

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple['400'];
    appLoader.pageIsReady = true;
  }, [ui, appLoader, theme]);

  return (
    <C.Box as="main">
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
