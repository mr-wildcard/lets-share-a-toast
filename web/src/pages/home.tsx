import React, { useEffect } from "react";
import * as C from "@chakra-ui/react";

import { firebaseData } from "@web/core/firebase/data";
import { APIPaths, pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import ColoredBackground from "@web/core/components/ColoredBackground";

const Home = () => {
  const { ui, appLoader } = useStores();

  useEffect(() => {
    window.document.title = "Let's share a TOAST";

    ui.currentPageBgColor = pageColors.homepage;
    appLoader.pageIsReady = true;
  }, []);

  return (
    <C.Box as="main">
      <ColoredBackground d="flex" flexDirection="column" p={0}>
        <C.Flex flex={1} h="100%" direction="column">
          <C.Box m="auto">
            <TOASTStatus />
          </C.Box>

          <TOASTActions />
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default Home;
