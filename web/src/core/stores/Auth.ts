// @ts-nocheck
import { makeObservable, observable } from 'mobx';

import { User } from '@shared';

export default class Auth {
  public profile: User = {};

  constructor() {
    makeObservable(this, {
      profile: observable,
    });
  }
}
