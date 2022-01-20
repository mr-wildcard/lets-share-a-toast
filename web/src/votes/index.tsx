import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { ToastStatus } from "@shared/enums";
import { CurrentToast } from "@shared/models";
import { getTOASTStatusUtils } from "@shared/utils";

import { firebaseData } from "@web/core/firebase/data";
import { pageColors } from "@web/core/constants";
import { ui } from "@web/core/stores/ui";
import { Page } from "@web/core/components/Page";
import {
  ClientSideVotingSessionProvider,
  ClientSideVotingSession,
} from "./stores/ClientSideVotingSession";
import { PreventUserInteractionsModal } from "./components/PreventUserInteractionsModal";
import { SubjectsList } from "./components/SubjectsList";
import { UserVotesLeft } from "./components/UserVotesLeft";
import { PageDisplayState } from "./types";

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
    return !!currentToast
      ? getTOASTStatusUtils(currentToast.status).isAfter(
          ToastStatus.OPEN_FOR_VOTE
        )
      : false;
  }, [currentToast]);

  return (
    <Page flex={1}>
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
          <Flex
            direction="column"
            justify="center"
            align="center"
            py="30px"
            w="full"
            h="full"
          >
            <Box flex={1}>vote list</Box>

            <Divider borderColor="gray.800" />

            <Box flex={1}>
              <SubjectsList />
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
          "It's not the time to vote... yet :)"
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
    </Page>
  );
};

export default observer(Votes);
