import { User as FirebaseUser } from "firebase/auth";
import { computed, makeObservable, observable } from "mobx";

import { CurrentToast, Subject, User } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

interface State extends Record<string, any> {
  connectedUser?: FirebaseUser | null;
  connectedUserLoaded: boolean;
  currentToast?: CurrentToast;
  currentToastLoaded: boolean;
  votingSession?: DatabaseVotingSession | null;
  votingSessionLoaded: boolean;
  users: User[];
  usersLoaded: boolean;
  subjects: Subject[];
  availableSubjects: Subject[];
  subjectsLoaded: boolean;
  appLoadingPercentage: number;
}

const state: State = {
  connectedUser: undefined,
  currentToast: undefined,
  votingSession: undefined,
  users: [],
  usersLoaded: false,
  subjects: [],
  subjectsLoaded: false,
  get availableSubjects() {
    return this.subjects.filter(
      (subject) => subject.status === SubjectStatus.AVAILABLE
    );
  },
  get connectedUserLoaded() {
    return this.connectedUser !== undefined;
  },
  get currentToastLoaded() {
    return this.currentToast !== undefined;
  },
  get votingSessionLoaded() {
    return this.votingSession !== undefined;
  },
  get appLoadingPercentage() {
    const data = [
      this.currentToastLoaded,
      this.connectedUserLoaded,
      this.votingSessionLoaded,
      this.subjectsLoaded,
      this.usersLoaded,
    ];

    return (data.filter(Boolean).length * 100) / data.length;
  },
};

export const firebaseData = makeObservable<State>(state, {
  connectedUser: observable,
  currentToast: observable,
  votingSession: observable,
  users: observable,
  usersLoaded: observable,
  subjects: observable,
  subjectsLoaded: observable,
  availableSubjects: computed,
  connectedUserLoaded: computed,
  currentToastLoaded: computed,
  votingSessionLoaded: computed,
  appLoadingPercentage: computed,
});
