import firebase from "firebase/app";
import { makeObservable, observable } from "mobx";

import { CurrentToast, Subject, User } from "@shared/models";
import { DatabaseVotingSession } from "@shared/firebase";

interface FirebaseInstance extends Record<string, any> {
  connectedUser: firebase.User | null;
  currentToast?: CurrentToast;
  votingSession?: DatabaseVotingSession | null;
  users: User[];
  subjects: Subject[];
}

const firebaseInstance: FirebaseInstance = {
  connectedUser: null,
  currentToast: undefined,
  votingSession: undefined,
  users: [],
  subjects: [],
};

export const firebaseData = makeObservable(firebaseInstance, {
  connectedUser: observable,
  currentToast: observable,
  votingSession: observable,
  users: observable,
  subjects: observable,
});
