import { useCallback } from "react";
import { getDatabase, ref, runTransaction, set } from "firebase/database";

import { DatabaseRefPaths } from "@shared/firebase";

import { firebaseData } from "@web/core/firebase/data";
import { useClientSideVotingSession } from "@web/votes/stores/ClientSideVotingSession";

export const useVote = () => {
  const { currentUserRemainingVotes } = useClientSideVotingSession();

  return useCallback(
    (subjectId) => {
      const database = getDatabase();
      const userSubjectVoteRef = ref(
        database,
        `${DatabaseRefPaths.VOTING_SESSION}/votes/${subjectId}/${
          firebaseData.connectedUser!.uid
        }`
      );

      if (currentUserRemainingVotes <= 0) {
        return set(userSubjectVoteRef, null);
      } else {
        return runTransaction(
          userSubjectVoteRef,
          (userTotalVotes: null | number) => {
            if (userTotalVotes) {
              return userTotalVotes + 1;
            } else {
              return 1;
            }
          }
        );
      }
    },
    [currentUserRemainingVotes]
  );
};
