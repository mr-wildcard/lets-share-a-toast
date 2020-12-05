import { computed, observable } from 'mobx';

import { spacing, header } from 'frontend/core/constants';

export default class UI {
  @observable
  public currentPageBgColor: string;

  @observable
  public windowWidth = 0;

  @observable
  public windowHeight = 0;

  constructor() {
    if (process.browser) {
      window.addEventListener('resize', this.setWindowSize.bind(this));
    }
  }

  @computed
  public get innerContentWidth() {
    return this.windowWidth - spacing.stylizedGap * 2;
  }

  @computed
  public get innerContentHeight() {
    return this.windowHeight - (header.height + spacing.stylizedGap);
  }

  public setWindowSize(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
}
