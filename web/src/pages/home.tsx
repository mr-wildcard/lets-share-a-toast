import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import ColoredBackground from "@web/core/components/ColoredBackground";

const Home = () => {
  const { ui } = useStores();

  useEffect(() => {
    window.document.title = "Let's share a TOAST";

    ui.currentPageBgColor = pageColors.homepage;
  }, []);

  return (
    <Box as="main">
      <ColoredBackground d="flex" flexDirection="column" p={0}>
        <Flex flex={1} h="100%" direction="column">
          <Box m="auto">
            <TOASTStatus />
          </Box>

          <TOASTActions />
        </Flex>
      </ColoredBackground>
    </Box>
  );
};

export default Home;
