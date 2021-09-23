import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ToastStatus } from "@shared/enums";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import { ui } from "@web/core/stores/ui";
import ColoredBackground from "@web/core/components/ColoredBackground";
import { PageDisplayState } from "@web/votes/types";
import { SubjectsList } from "@web/votes/SubjectsList";
import { PeopleCantVoteModal } from "@web/votes/PeopleCantVoteModal";

function getInitialPageState(): PageDisplayState {
  if (!!firebaseData.currentToast) {
    if (firebaseData.currentToast.status === ToastStatus.OPEN_FOR_VOTE) {
      return PageDisplayState.TIME_TO_VOTE;
    } else {
      return PageDisplayState.ERROR_WRONG_TOAST_STATUS;
    }
  } else {
    return PageDisplayState.ERROR_NO_TOAST;
  }
}

const Votes = () => {
  const [pageLoadingState, setPageLoadingState] = useState<PageDisplayState>(
    getInitialPageState()
  );

  useEffect(() => {
    window.document.title = "Votes | Let's share a TOAST";

    ui.currentPageBgColor = pageColors.votingSession;
  }, []);

  return (
    <ColoredBackground flex={1}>
      <Flex direction="column">
        {pageLoadingState === PageDisplayState.ERROR_NO_TOAST &&
          "La session n'existe pas!"}

        {pageLoadingState === PageDisplayState.ERROR_WRONG_TOAST_STATUS &&
          "Ce n'est pas le moment de voter!"}

        {pageLoadingState === PageDisplayState.TIME_TO_VOTE && (
          <Flex direction="column">
            <Box flex={1}>
              <SubjectsList
                votingSession={firebaseData.votingSession!}
                currentToast={firebaseData.currentToast!}
              />
            </Box>

            <PeopleCantVoteModal
              isOpen={!firebaseData.currentToast!.peopleCanVote}
            />
          </Flex>
        )}
      </Flex>
    </ColoredBackground>
  );
};

export default observer(Votes);
