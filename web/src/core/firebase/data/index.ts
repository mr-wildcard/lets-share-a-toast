import firebase from "firebase/app";
import { makeObservable, observable } from "mobx";

import { CurrentToast, Subject, User } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";

interface State extends Record<string, any> {
  connectedUser?: firebase.User | null;
  currentToast?: CurrentToast;
  votingSession?: DatabaseVotingSession | null;
  users: User[];
  usersLoaded: boolean;
  subjects: Subject[];
  subjectsLoaded: boolean;
}

const state: State = {
  connectedUser: undefined,
  currentToast: undefined,
  votingSession: undefined,
  users: [],
  usersLoaded: false,
  subjects: [],
  subjectsLoaded: false,
};

export const firebaseData = makeObservable(state, {
  connectedUser: observable,
  currentToast: observable,
  votingSession: observable,
  users: observable,
  usersLoaded: observable,
  subjects: observable,
  subjectsLoaded: observable,
});
