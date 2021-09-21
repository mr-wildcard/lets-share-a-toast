import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ToastStatus } from "@shared/enums";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors, spacing } from "@web/core/constants";
import { ui } from "@web/core/stores/ui";
import ColoredBackground from "@web/core/components/ColoredBackground";
import { LoadingState } from "@web/votes/types";
import { Subjects } from "@web/votes/Subjects";
import { PeopleCantVoteModal } from "@web/votes/PeopleCantVoteModal";

const Votes = () => {
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
    <ColoredBackground flex={1}>
      <Flex direction="column" p={`${spacing.stylizedGap}px`}>
        {loadingState === null && "Chargement en cours..."}
        {loadingState !== null && (
          <>
            {loadingState === LoadingState.ERROR_NO_SESSION &&
              "La session n'existe pas!"}

            {loadingState === LoadingState.ERROR_WRONG_SESSION_STATUS &&
              "Ce n'est pas le moment de voter!"}

            {loadingState === LoadingState.ERROR_UNKNOWN_ERROR &&
              "Une erreur inconnue s'est produite... 🤔"}

            {loadingState === LoadingState.READY && (
              <>
                <Subjects currentToast={firebaseData.currentToast!} />

                {!firebaseData.currentToast!.peopleCanVote && (
                  <PeopleCantVoteModal />
                )}
              </>
            )}
          </>
        )}
      </Flex>
    </ColoredBackground>
  );
};

export default observer(Votes);
