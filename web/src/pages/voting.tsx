import React, { useEffect, useState } from "react";
import * as C from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import useSWR from "swr";

import { Subject, Toast } from "@shared/models";
import { SubjectStatus, ToastStatus } from "@shared/enums";

import firebase from "@web/core/firebase";
import { APIPaths, pageColors } from "@web/core/constants";
import useStores from "@web/core/hooks/useStores";
import isToast from "@web/core/helpers/isToast";
import ColoredBackground from "@web/core/components/ColoredBackground";
import { LoadingErrorCode } from "@web/votes/types";
import LoadingError from "@web/votes/LoadingError";
import {
  DatabaseRefPaths,
  DatabaseVotingSession,
  FirestoreCollection,
} from "@shared/firebase";

const VotingSession = () => {
  const {
    currentToastSession: { toast },
    voting,
    ui,
    appLoader,
    auth,
  } = useStores();

  const [loadingError, setLoadingError] = useState<null | LoadingErrorCode>(
    null
  );

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [
    votingSession,
    setVotingSession,
  ] = useState<null | DatabaseVotingSession>(null);

  useEffect(() => {
    ui.currentPageBgColor = pageColors.votingSession;
    appLoader.pageIsReady = true;

    let disposeFirebaseSubjectsListener: () => void;
    let disposeFirebaseVotingSessionListener: () => void;

    if (!!firebase.currentToast) {
      if (firebase.currentToast.status === ToastStatus.OPEN_FOR_VOTE) {
        setLoadingError(null);

        disposeFirebaseSubjectsListener = firebase.firestore
          .collection(FirestoreCollection.SUBJECTS)
          .where("status", "==", SubjectStatus.AVAILABLE)
          .onSnapshot((snapshot) => {
            setSubjects(snapshot.docs.map((doc) => doc.data()));
          });

        disposeFirebaseVotingSessionListener = firebase.database
          .ref(DatabaseRefPaths.VOTING_SESSION)
          .on("value", (snapshot) => {
            setVotingSession(snapshot.val() as DatabaseVotingSession);
          });
      } else {
        setLoadingError(LoadingErrorCode.WRONG_SESSION_STATUS);
      }
    } else {
      setLoadingError(LoadingErrorCode.NO_SESSION);
    }

    return () => {
      if (typeof disposeFirebaseSubjectsListener === "function") {
        disposeFirebaseSubjectsListener();
      }

      if (typeof disposeFirebaseVotingSessionListener === "function") {
        disposeFirebaseVotingSessionListener();
      }
    };
  }, []);

  useEffect(() => {
    let listenToVotesHandler: Function;

    if (voting.initialized && isToast(toast)) {
      listenToVotesHandler = voting.listenToVotes(toast.id);
    }

    return () => {
      if (typeof listenToVotesHandler === "function") {
        listenToVotesHandler();
      }
    };
  }, [voting.initialized]);

  return (
    <C.Box as="main">
      <title>Voting session | Let&apos;s share a TOAST</title>

      <ColoredBackground>
        <C.Flex direction="column">
          {(!voting.initialized || !voting.session) && (
            <>
              {loadingError === null && "Chargement en cours..."}
              {loadingError !== null && <LoadingError error={loadingError} />}
            </>
          )}

          {voting.initialized && !!voting.session && (
            <C.Box>
              <C.Box>
                {Object.keys(voting.session.votes).map((subjectId) => {
                  return (
                    <C.Button
                      key={subjectId}
                      m={3}
                      onClick={() =>
                        voting.toggleVote({
                          currentToastId: toast!.id,
                          userId: "john-doe",
                          // auth.profile.id,
                          subjectId: subjectId,
                        })
                      }
                    >
                      {subjectId}
                    </C.Button>
                  );
                })}
              </C.Box>
              <pre>
                <code>{JSON.stringify(voting.session, null, 3)}</code>
              </pre>
            </C.Box>
          )}
        </C.Flex>
      </ColoredBackground>
    </C.Box>
  );
};

export default observer(VotingSession);
