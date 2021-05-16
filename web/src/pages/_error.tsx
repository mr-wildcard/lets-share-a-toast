import React, { useEffect, useMemo } from "react";
import * as C from "@chakra-ui/react";

import ColoredBackground from "@web/core/components/ColoredBackground";
import useStores from "@web/core/hooks/useStores";
import Image from "@web/core/components/Image";
import HighlightedText from "@web/core/components/HighlightedText";

const errorIllustrations = [
  {
    width: 300,
    height: 242,
    src: "https://media.giphy.com/media/dphDDCpGfzJPq/giphy.gif",
  },
  {
    width: 301,
    height: 300,
    src: "https://media.giphy.com/media/kag03aW6qmohqz538Q/giphy.gif",
  },
];

const Error = () => {
  const theme = C.useTheme();

  const { ui } = useStores();

  const illustration = useMemo(() => {
    return errorIllustrations[
      Math.floor(Math.random() * errorIllustrations.length)
    ];
  }, []);

  useEffect(() => {
    ui.currentPageBgColor = theme.colors.purple["400"];
  }, []);

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

export default Error;
