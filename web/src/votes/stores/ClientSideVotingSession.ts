import { createContext, useContext } from "react";
import { computed, makeObservable } from "mobx";

import { Toast } from "@shared/models";
import { getSelectedSubjectIds, getUserTotalVotes } from "@shared/utils";
import { DatabaseVotingSession } from "@shared/firebase";
import { firebaseData } from "@web/core/firebase/data";

const clientSideVotingSessionContext =
  createContext<null | ClientSideVotingSession>(null);

export const { Provider: ClientSideVotingSessionProvider } =
  clientSideVotingSessionContext;

export function useClientSideVotingSession() {
  return useContext(clientSideVotingSessionContext) as ClientSideVotingSession;
}

export class ClientSideVotingSession {
  constructor(
    private readonly toast: Toast,
    private readonly votingSession: DatabaseVotingSession,
    private readonly connectedUserId: string
  ) {
    makeObservable(this, {
      currentUserTotalVotes: computed,
      currentUserRemainingVotes: computed,
      selectedSubjectIds: computed,
      selectedSubjects: computed,
      userIdAvatarMapping: computed,
    });
  }

  get selectedSubjectIds() {
    if (!this.votingSession?.votes) {
      return [];
    }

    return getSelectedSubjectIds(
      this.votingSession.votes,
      this.toast.maxSelectableSubjects
    );
  }

  get selectedSubjects() {
    return this.selectedSubjectIds.map((subjectId) => {
      return firebaseData.subjects.find((subject) => subject.id === subjectId)!;
    });
  }

  get currentUserTotalVotes() {
    return getUserTotalVotes(this.connectedUserId, this.votingSession?.votes);
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
