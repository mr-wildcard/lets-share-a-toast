import React, { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { pageColors } from "@web/core/constants";
import TOASTActions from "@web/homepage/TOASTActions";
import TOASTStatus from "@web/homepage/TOASTStatus";
import { ui } from "@web/core/stores/ui";
import { Page } from "@web/core/components/Page";
import { firebaseData } from "@web/core/firebase/data";

const Home = () => {
  const { currentToast } = firebaseData;

  useEffect(() => {
    window.document.title = "Let's share a TOAST";

    ui.currentPageBgColor = pageColors.homepage;
  }, []);

  return (
    <Page flex={1} display="flex" flexDirection="column" padding={0}>
      <Flex flex={1} height="100%" direction="column">
        <Box m="auto">
          <TOASTStatus currentToast={currentToast} />
        </Box>

        <TOASTActions currentToast={currentToast} />
      </Flex>
    </Page>
  );
};

export default observer(Home);
