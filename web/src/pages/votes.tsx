import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ToastStatus } from "@shared/enums";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import ColoredBackground from "@web/core/components/ColoredBackground";
import { LoadingState } from "@web/votes/types";
import { Subjects } from "@web/votes/Subjects";

const Votes = () => {
  const { ui } = useStores();

  const [loadingState, setLoadingState] = useState<null | LoadingState>(null);

  useEffect(() => {
    window.document.title = "Votes | Let's share a TOAST";

    ui.currentPageBgColor = pageColors.votingSession;
  }, []);

  useEffect(() => {
    if (!!firebaseData.currentToast) {
      if (firebaseData.currentToast.status === ToastStatus.OPEN_FOR_VOTE) {
        setLoadingState(LoadingState.READY);
      } else {
        setLoadingState(LoadingState.ERROR_WRONG_SESSION_STATUS);
      }
    } else {
      setLoadingState(LoadingState.ERROR_NO_SESSION);
    }
  }, []);

  return (
    <Box as="main">
      <ColoredBackground>
        <Flex direction="column">
          {loadingState === null && "Chargement en cours..."}
          {loadingState !== null && (
            <>
              {loadingState === LoadingState.ERROR_NO_SESSION &&
                "La session n'existe pas!"}

              {loadingState === LoadingState.ERROR_WRONG_SESSION_STATUS &&
                "Ce n'est pas le moment de voter!"}

              {loadingState === LoadingState.ERROR_UNKNOWN_ERROR &&
                "Une erreur inconnue s'est produite... 🤔"}

              {loadingState === LoadingState.READY && <Subjects />}
            </>
          )}
        </Flex>
      </ColoredBackground>
    </Box>
  );
};

export default observer(Votes);
