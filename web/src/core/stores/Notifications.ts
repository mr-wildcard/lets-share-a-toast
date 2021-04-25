// @ts-nocheck
import { Socket } from "socket.io-client";
import { computed, makeObservable, observable, reaction } from "mobx";

import { User } from "@shared/models";

import NotificationType from "@web/notifications/types/NotificationType";
import Toaster from "@web/notifications/types/Toaster";
import notifier from "@web/notifications/handler";

export default class Notifications {
  private socket: SocketIOClient.Socket;
  private listenedEvents: [NotificationType, () => void][];
  private initializing = false;
  private notifier: any;

  public showNotifications = true;
  public connecting = true;
  public pageIsVisible = true;

  constructor() {
    makeObservable(this, {
      showNotifications: observable,
      connecting: observable,
      pageIsVisible: observable,
    });

    const savedShowNotifications = localStorage.getItem("show_notifications");

    if (savedShowNotifications) {
      this.showNotifications = savedShowNotifications === "1";
    } else {
      localStorage.setItem("show_notifications", "1");
    }

    reaction(
      () => this.showNotifications,
      (show) => {
        localStorage.setItem("show_notifications", show ? "1" : "0");
      }
    );
  }

  public async initialize(toaster: Toaster): Promise<void> {
    this.initializing = true;

    this.notifier = notifier(toaster);

    // const { getNotificationSocket } = await import('@web/core/sockets');

    // this.socket = getNotificationSocket;

    this.listenedEvents = [
      /**
       * Subject notifications
       */
      [NotificationType.ADD_SUBJECT, this.notifier.addSubject],
      [NotificationType.EDIT_SUBJECT_CONTENT, this.notifier.editSubject],
      [NotificationType.EDIT_SUBJECT_STATUS, this.notifier.editSubjectStatus],
      [NotificationType.REMOVE_SUBJECT, this.notifier.removeSubject],

      /**
       * TOAST notifications
       */
      [NotificationType.CREATE_TOAST, this.notifier.createTOAST],
      [NotificationType.EDIT_TOAST_INFOS, this.notifier.editTOASTInfos],
      [NotificationType.EDIT_TOAST_STATUS, this.notifier.editTOASTStatus],
    ];

    this.watchSocketState();

    reaction(
      () => this.showNotifications,
      (listenToNotifications) => {
        this.toggleNotifications(listenToNotifications);
      },
      {
        fireImmediately: true,
      }
    );

    this.socket.open();

    this.initializing = false;
  }

  public send(user: User, event: NotificationType, data?: any): void {
    return;

    this.socket.emit(event, {
      username: user.firstName,
      userPicture: user.picture,
      userId: user.id,
      ...data,
    });
  }

  private toggleNotifications(listen: boolean): void {
    this.listenedEvents.forEach(([eventName, handler]) => {
      if (listen) {
        this.socket.on(eventName, handler);
      } else {
        this.socket.off(eventName, handler);
      }
    });
  }

  private watchSocketState(): void {
    this.socket.on("reconnecting", () => {
      this.connecting = true;
    });

    this.socket.on("connect", () => {
      this.connecting = false;
    });
  }
}
