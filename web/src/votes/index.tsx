import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ToastStatus } from "@shared/enums";
import { CurrentToast } from "@shared/models";
import { getTOASTStatusUtils } from "@shared/utils";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import { ui } from "@web/core/stores/ui";
import ColoredBackground from "@web/core/components/ColoredBackground";
import {
  ClientSideVotingSessionProvider,
  ClientSideVotingSession,
} from "./stores/ClientSideVotingSession";
import { PreventUserInteractionsModal } from "./components/PreventUserInteractionsModal";
import { SubjectsList } from "./components/SubjectsList";
import { UserVotesLeft } from "./components/UserVotesLeft";
import { PageDisplayState } from "./types";
import styles from "./index.module.css";

function getPageState(currentToast?: CurrentToast): PageDisplayState {
  if (!!currentToast) {
    if (currentToast.status === ToastStatus.OPEN_FOR_VOTE) {
      return PageDisplayState.TIME_TO_VOTE;
    } else {
      return PageDisplayState.ERROR_WRONG_TOAST_STATUS;
    }
  } else {
    return PageDisplayState.ERROR_NO_TOAST;
  }
}

const Votes = () => {
  const currentToast = firebaseData.currentToast;

  const [pageState, setPageState] = useState<PageDisplayState>(
    getPageState(currentToast)
  );

  useEffect(() => {
    window.document.title = "Votes | Let's share a TOAST";

    ui.currentPageBgColor = pageColors.votingSession;
  }, []);

  useEffect(() => {
    setPageState(getPageState(currentToast));
  }, [currentToast]);

  const toastStatusIsAfterVoteOpened = useMemo(() => {
    return !!firebaseData.currentToast
      ? getTOASTStatusUtils(firebaseData.currentToast.status).isAfter(
          ToastStatus.OPEN_FOR_VOTE
        )
      : false;
  }, [firebaseData.currentToast]);

  return (
    <ColoredBackground h="full" overflow="hidden">
      {pageState === PageDisplayState.TIME_TO_VOTE && (
        <ClientSideVotingSessionProvider
          value={
            new ClientSideVotingSession(
              firebaseData.currentToast!,
              firebaseData.votingSession!,
              firebaseData.connectedUser!.uid
            )
          }
        >
          <Flex direction="column" justify="center" h="100%">
            <Box>
              <UserVotesLeft />
            </Box>
            <Box flex={1} d="flex" h="full" w="full" overflowY="auto">
              <Flex
                as="section"
                direction="row"
                justify="end"
                flex={1}
                overflowY="auto"
                className={styles.subjectListSection}
              >
                <Box flex={1} py={4} my="auto">
                  <SubjectsList
                    votingSession={firebaseData.votingSession!}
                    currentToast={firebaseData.currentToast!}
                  />
                </Box>
              </Flex>
            </Box>
          </Flex>
        </ClientSideVotingSessionProvider>
      )}

      <PreventUserInteractionsModal
        isOpen={pageState === PageDisplayState.ERROR_NO_TOAST}
        title="Whoops"
      >
        No TOAST have been created yet.
      </PreventUserInteractionsModal>

      <PreventUserInteractionsModal
        isOpen={pageState === PageDisplayState.ERROR_WRONG_TOAST_STATUS}
        title="Whoops"
      >
        {toastStatusIsAfterVoteOpened ? (
          <>
            Thank you for your participation!
            <br />
            The voting session is now closed.
          </>
        ) : (
          "It's not the time to vote, yet :)"
        )}
      </PreventUserInteractionsModal>

      <PreventUserInteractionsModal
        isOpen={
          pageState === PageDisplayState.TIME_TO_VOTE &&
          !firebaseData.currentToast?.peopleCanVote
        }
        title="Whoops"
      >
        Voting session has been paused.
      </PreventUserInteractionsModal>
    </ColoredBackground>
  );
};

export default observer(Votes);
