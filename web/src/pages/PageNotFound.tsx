import React, { useEffect } from "react";
import { Flex, Heading, useTheme } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import Image from "@web/core/components/Image";
import HighlightedText from "@web/core/components/HighlightedText";
import { ui } from "@web/core/stores/ui";

const PageNotFound = () => {
  const theme = useTheme();

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple["400"];
  }, []);

  return (
    <Flex
      flex={1}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
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
        <HighlightedText bgColor="black">
          {Math.random() > 0.5 ? "u lost?" : "are you monkey testing me??"}
        </HighlightedText>
      </Heading>
    </Flex>
  );
};

export default observer(PageNotFound);
