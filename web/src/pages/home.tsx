import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as C from "@chakra-ui/react";
import useSWR from "swr";

import { CurrentToast } from "@shared/models";

import { APIPaths, pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import ColoredBackground from "@web/core/components/ColoredBackground";

const Home = () => {
  const { ui, appLoader, currentToastSession } = useStores();

  useEffect(() => {
    ui.currentPageBgColor = pageColors.homepage;
    appLoader.pageIsReady = currentToastSession.isLoaded;
  }, []);

  return (
    <C.Box as="main">
      {currentToastSession.isLoaded && (
        <ColoredBackground d="flex" flexDirection="column" p={0}>
          <C.Flex flex={1} h="100%" direction="column">
            <C.Box m="auto">
              <TOASTStatus currentToast={currentToastSession.toast} />
            </C.Box>

            <TOASTActions currentToast={currentToastSession.toast} />
          </C.Flex>
        </ColoredBackground>
      )}
    </C.Box>
  );
};

export default observer(Home);
