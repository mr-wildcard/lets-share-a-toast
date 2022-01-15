import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { pageColors } from "@web/core/constants";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import { ui } from "@web/core/stores/ui";
import { Page } from "@web/core/components/Page";

const Home = () => {
  useEffect(() => {
    window.document.title = "Let's share a TOAST";

    ui.currentPageBgColor = pageColors.homepage;
  }, []);

  return (
    <Page flex={1} d="flex" flexDirection="column" p={0}>
      <Flex flex={1} h="100%" direction="column">
        <Box m="auto">
          <TOASTStatus />
        </Box>

        <TOASTActions />
      </Flex>
    </Page>
  );
};

export default Home;
