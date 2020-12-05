import { observable, when } from 'mobx';
import { firestore, User } from 'firebase';

import { Toast, FirebaseVotingSession } from '@letsshareatoast/shared';

export default class Voting {
  private _currentToast: Toast;

  @observable
  private _database: firestore.Firestore;

  @observable
  public initialized = false;

  @observable
  public session: FirebaseVotingSession;

  private firebaseUser: User;

  constructor() {
    when(
      () => !!this._database,
      () => {
        this._database
          .collection('voting-session')
          .doc(this._currentToast.id)
          .onSnapshot((doc) => {
            this.session = doc.data();
          });
      }
    );

    when(
      () => !!this.session,
      () => {
        this.initialized = true;
      }
    );
  }

  public async initialize(currentToast: Toast): Promise<void> {
    this._currentToast = currentToast;

    const { init, signin, getDatabase } = await import('../firebase');

    init();

    if (!this.firebaseUser) {
      this.firebaseUser = await signin();
    }

    this._database = getDatabase();
  }

  public async closeVotingSession(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
}
