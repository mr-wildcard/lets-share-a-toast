import { Socket } from 'socket.io-client';
import { observable, reaction } from 'mobx';

import { User } from '@letsshareatoast/shared';

import getSupportedVisibilityAPI from 'frontend/core/helpers/getSupportedVisibilityAPI';
import NotificationType from 'frontend/notifications/types/NotificationType';
import Toaster from 'frontend/notifications/types/Toaster';
import notifier from 'frontend/notifications/handler';

export default class Notifications {
  private _socket: Socket;
  private _listenedEvents: [NotificationType, () => void][];
  private _initializing = false;
  private _toaster: any;
  private _notifier: any;

  @observable
  public showNotifications = true;

  @observable
  public connecting = true;

  @observable
  public pageIsVisible = true;

  constructor() {
    if (process.browser) {
      const savedShowNotifications = localStorage.getItem('show_notifications');

      if (savedShowNotifications) {
        this.showNotifications = savedShowNotifications === '1';
      } else {
        localStorage.setItem('show_notifications', '1');
      }

      reaction(
        () => this.showNotifications,
        (show) => {
          localStorage.setItem('show_notifications', show ? '1' : '0');
        }
      );
    }
  }

  public async initialize(toaster: Toaster): Promise<void> {
    this._initializing = true;

    this._notifier = notifier(toaster);

    const { default: getSocket } = await import('frontend/core/socket');

    this._socket = getSocket();

    this._listenedEvents = [
      /**
       * Subject notifications
       */
      [NotificationType.ADD_SUBJECT, this._notifier.addSubject],
      [NotificationType.EDIT_SUBJECT_CONTENT, this._notifier.editSubject],
      [NotificationType.EDIT_SUBJECT_STATUS, this._notifier.editSubjectStatus],
      [NotificationType.REMOVE_SUBJECT, this._notifier.removeSubject],

      /**
       * TOAST notifications
       */
      [NotificationType.CREATE_TOAST, this._notifier.createTOAST],
      [NotificationType.EDIT_TOAST_INFOS, this._notifier.editTOASTInfos],
      [NotificationType.EDIT_TOAST_STATUS, this._notifier.editTOASTStatus],
    ];

    this._watchSocketState();
    this._watchDocumentVisibility();

    reaction(
      () => this.showNotifications && this.pageIsVisible,
      (listenToNotifications) => {
        this._toggleNotifications(listenToNotifications);
      },
      {
        fireImmediately: true,
      }
    );

    this._socket.open();

    this._initializing = false;
  }

  public send(user: User, event: NotificationType, data?: any): void {
    return;

    this._socket.emit(event, {
      username: user.firstName,
      userPicture: user.picture,
      userId: user.id,
      ...data,
    });
  }

  private _toggleNotifications(listen: boolean): void {
    this._listenedEvents.forEach(([eventName, handler]) => {
      if (listen) {
        this._socket.on(eventName, handler);
      } else {
        this._socket.off(eventName, handler);
      }
    });
  }

  private _watchSocketState(): void {
    this._socket.on('reconnecting', () => {
      this.connecting = true;
    });

    this._socket.on('connect', () => {
      this.connecting = false;
    });
  }

  private _watchDocumentVisibility(): void {
    const {
      documentHiddenProperty,
      visibilityChangeEventName,
    } = getSupportedVisibilityAPI();

    this.pageIsVisible = !document[documentHiddenProperty];

    window.addEventListener(
      visibilityChangeEventName,
      () => {
        this.pageIsVisible = !document[documentHiddenProperty];
      },
      false
    );
  }
}
