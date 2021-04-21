import { computed, makeObservable, observable } from 'mobx';

import { spacing, header } from '@web/core/constants';

export default class UI {
  public currentPageBgColor: string = '';
  public windowWidth = 0;
  public windowHeight = 0;

  constructor() {
    makeObservable(this, {
      currentPageBgColor: observable,
      windowWidth: observable,
      windowHeight: observable,
      innerContentWidth: computed,
      innerContentHeight: computed,
    });

    window.addEventListener('resize', this.setWindowSize.bind(this));
  }

  public get innerContentWidth() {
    return this.windowWidth - spacing.stylizedGap * 2;
  }

  public get innerContentHeight() {
    return this.windowHeight - (header.height + spacing.stylizedGap);
  }

  public setWindowSize(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }
}
