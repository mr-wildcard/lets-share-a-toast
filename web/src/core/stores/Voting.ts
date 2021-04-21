// @ts-nocheck
import { computed, makeObservable, observable } from 'mobx';
import firebase from 'firebase';

import {
  FirebaseCollections,
  FirebaseVotingSessionDocument,
  ClientSideVoteEvent,
  RealTimeVote,
} from '@shared';

export default class Voting {
  private initializing = false;
  private database: firebase.firestore.Firestore;
  private firebaseUser: firebase.auth.UserCredential;
  private socket: SocketIOClient.Socket;

  public initialized = false;
  public session: FirebaseVotingSessionDocument = undefined;

  constructor() {
    makeObservable(this, {
      session: observable,
    });
  }

  public async initialize(): Promise<void> {
    if (this.initializing || this.initialized) {
      return;
    }

    this.initializing = true;

    const { init } = await import('@web/core/firebase');

    const { database, signin } = init();

    if (!this.firebaseUser) {
      this.firebaseUser = await signin();
    }

    if (!this.database) {
      this.database = database;
    }

    if (!this.socket) {
      const { getVotingSessionSocket } = await import('@web/core/sockets');

      this.socket = getVotingSessionSocket();
    }

    this.initializing = false;
    this.initialized = true;
  }

  public listenToVotes(currentToastId: string) {
    const removeVotesListener = this.database
      .collection(FirebaseCollections.VOTING_SESSION)
      .doc(currentToastId)
      .onSnapshot(
        (
          doc: firebase.firestore.DocumentSnapshot<FirebaseVotingSessionDocument>
        ) => {
          this.session = doc.data();
        }
      );

    return () => {
      removeVotesListener();

      this.session = undefined;
    };
  }

  public toggleVote(vote: RealTimeVote): void {
    this.socket.emit(ClientSideVoteEvent.TOGGLED_VOTE, vote);
  }

  public async closeVotingSession(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}
