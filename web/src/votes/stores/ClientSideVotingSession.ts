import { createContext, useContext } from "react";
import { computed, makeObservable } from "mobx";

import { getSelectedSubjectIds, getUserTotalVotes } from "@shared/utils";
import { Toast } from "@shared/models";

import { firebaseData } from "@web/core/firebase/data";

const clientSideVotingSessionContext =
  createContext<null | ClientSideVotingSession>(null);

export const { Provider: ClientSideVotingSessionProvider } =
  clientSideVotingSessionContext;

export function useClientSideVotingSession() {
  return useContext(clientSideVotingSessionContext) as ClientSideVotingSession;
}

export class ClientSideVotingSession {
  constructor(private readonly toast: Toast) {
    makeObservable(this, {
      currentUserTotalVotes: computed,
      currentUserRemainingVotes: computed,
      selectedSubjectIds: computed,
      selectedSubjects: computed,
      userIdAvatarMapping: computed,
    });
  }

  getUserTotalVotesForSubjectId(subjectId: string) {
    return (
      firebaseData.votingSession?.votes?.[subjectId]?.[
        firebaseData.connectedUser!.uid
      ] ?? 0
    );
  }

  get selectedSubjectIds() {
    if (!firebaseData.votingSession?.votes) {
      return [];
    }

    return getSelectedSubjectIds(
      firebaseData.votingSession.votes,
      this.toast.maxSelectableSubjects
    );
  }

  get selectedSubjects() {
    return this.selectedSubjectIds.map((subjectId) => {
      return firebaseData.subjects.find((subject) => subject.id === subjectId)!;
    });
  }

  get currentUserTotalVotes() {
    return getUserTotalVotes(
      firebaseData.connectedUser!.uid,
      firebaseData.votingSession?.votes
    );
  }

  get currentUserRemainingVotes() {
    return this.toast.maxVotesPerUser - this.currentUserTotalVotes;
  }

  get userIdAvatarMapping() {
    return firebaseData.users.reduce((mapping, user) => {
      mapping.set(user.id, user.photoURL);

      return mapping;
    }, new Map());
  }
}
