import { computed, observable } from 'mobx';

export default class AppLoading {
  @observable
  public profileLoaded = false;

  @observable
  public pageLoaded = false;

  @observable
  loaderEntering = true;

  @observable
  loaderEntered = false;

  @computed
  public get appLoaded() {
    return this.profileLoaded && this.pageLoaded;
  }
}
