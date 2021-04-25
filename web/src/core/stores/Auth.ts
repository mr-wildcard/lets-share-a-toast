import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { User } from "@shared/models";

export default class Auth {
  public profile!: firebase.User;

  constructor() {
    makeAutoObservable(this);
  }
}
