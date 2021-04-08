import { makeObservable, observable } from 'mobx';

import { User } from '@letsshareatoast/shared';

export default class Auth {
  public profile: null | User = null;

  constructor() {
    makeObservable(this, {
      profile: observable,
    });
  }
}
