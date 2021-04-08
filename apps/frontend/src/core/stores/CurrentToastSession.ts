import { computed, makeObservable, observable, when } from 'mobx';

import { CurrentToast } from '@letsshareatoast/shared';

import isToast from 'frontend/core/helpers/isToast';
import { APIPaths } from '../constants';

export default class CurrentToastSession {
  public toast: CurrentToast;

  constructor() {
    makeObservable(this, {
      toast: observable,
      isLoaded: computed,
      isOngoing: computed,
    });

    if (process.browser) {
      const evtSource = new EventSource(
        process.env.NEXT_PUBLIC_API_URL + APIPaths.TOAST_CURRENT_SYNC
      );

      evtSource.onmessage = this.onTOASTChanged.bind(this);
    }
  }

  onTOASTChanged(message: MessageEvent) {
    try {
      this.toast = JSON.parse(message.data);
    } catch (error) {
      console.error("Couln't parse toast object sent over SSE :", message);
    }
  }

  public get isLoaded() {
    return typeof this.toast !== 'undefined';
  }

  public get isOngoing() {
    return isToast(this.toast);
  }
}
