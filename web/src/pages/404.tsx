import React, { useEffect } from "react";
import { Box, Flex, Heading, useTheme } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import ColoredBackground from "@web/core/components/ColoredBackground";
import Image from "@web/core/components/Image";
import HighlightedText from "@web/core/components/HighlightedText";
import { ui } from "@web/core/stores/ui";

const PageNotFound = () => {
  const theme = useTheme();

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple["400"];
  }, []);

  return (
    <ColoredBackground
      d="flex"
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
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

      <Heading as="h2" fontSize="2xl" fontWeight="bold" color="white" mt={3}>
        <HighlightedText bgColor="black">Page not found</HighlightedText>
      </Heading>
    </ColoredBackground>
  );
};

export default observer(PageNotFound);
