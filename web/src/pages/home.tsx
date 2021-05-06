import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as C from "@chakra-ui/react";
import { toJS } from "mobx";

import { CurrentToast } from "@shared/models";

import firebase from "@web/core/firebase";
import { APIPaths, pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import ColoredBackground from "@web/core/components/ColoredBackground";

const Home = () => {
  const { ui, appLoader } = useStores();

  const { currentToast } = firebase;

  useEffect(() => {
    ui.currentPageBgColor = pageColors.homepage;
    appLoader.pageIsReady = true;
  }, []);

  return (
    <C.Box as="main">
      <ColoredBackground d="flex" flexDirection="column" p={0}>
        <C.Flex flex={1} h="100%" direction="column">
          <C.Box m="auto">
            <TOASTStatus currentToast={toJS(currentToast as CurrentToast)} />
          </C.Box>

          <TOASTActions currentToast={toJS(currentToast as CurrentToast)} />
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(Home);
