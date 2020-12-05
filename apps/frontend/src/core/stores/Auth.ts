import { observable } from 'mobx';

import { User } from '@letsshareatoast/shared';

export default class Auth {
  @observable
  public profile: null | User = null;
}
