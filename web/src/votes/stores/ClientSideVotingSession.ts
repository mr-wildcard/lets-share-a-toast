import { createContext, useContext } from "react";
import { computed, isObservable, makeObservable } from "mobx";

import { Toast } from "@shared/models";
import { getUserTotalVotes } from "@shared/utils";
import { DatabaseVotingSession } from "@shared/firebase";

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
    });
  }

  get currentUserTotalVotes() {
    return getUserTotalVotes(this.connectedUserId, this.votingSession?.votes);
  }

  get currentUserRemainingVotes() {
    return this.toast.maxVotesPerUser - this.currentUserTotalVotes;
  }
}
