import { User as FirebaseUser } from "firebase/auth";
import { computed, makeObservable, observable } from "mobx";

import { CurrentToast, Subject, User } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";
import { SubjectStatus } from "@shared/enums";

interface State extends Record<string, any> {
  connectedUser?: FirebaseUser | null;
  currentUserIsLoaded: boolean;
  connectedUserExists: boolean;
  currentToast?: CurrentToast;
  currentToastExists: boolean;
  votingSession?: DatabaseVotingSession;
  votingSessionExists: boolean;
  users: User[];
  usersLoaded: boolean;
  subjects: Subject[];
  availableSubjects: Subject[];
  subjectsLoaded: boolean;
  dataLoadingPercentage: number;
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
  get currentUserIsLoaded() {
    return this.connectedUser !== undefined;
  },
  get connectedUserExists() {
    return !!this.connectedUser;
  },
  get currentToastExists() {
    return this.currentToast !== undefined;
  },
  get votingSessionExists() {
    return this.votingSession !== undefined;
  },
  get dataLoadingPercentage() {
    const data = [
      this.currentToastExists,
      this.connectedUserExists,
      this.votingSessionExists,
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
  currentUserIsLoaded: computed,
  connectedUserExists: computed,
  currentToastExists: computed,
  votingSessionExists: computed,
  dataLoadingPercentage: computed,
});
