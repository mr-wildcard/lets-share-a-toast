import { computed, makeObservable, observable } from 'mobx';

export default class AppLoader {
  public profileIsLoaded = false;
  public pageIsReady = false;

  constructor() {
    makeObservable(this, {
      profileIsLoaded: observable,
      pageIsReady: observable,
      appLoaded: computed,
    });
  }

  public get appLoaded() {
    return this.profileIsLoaded && this.pageIsReady;
  }
}
