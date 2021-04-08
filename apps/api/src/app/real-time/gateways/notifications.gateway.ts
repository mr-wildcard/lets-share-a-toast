import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

import { WebSocketNamespaces } from '@letsshareatoast/shared';

import { NotificationType } from 'api/enums/NotificationType';

@WebSocketGateway({
  transport: 'websocket',
  namespace: WebSocketNamespaces.NOTIFICATIONS,
})
export class NotificationsGateway {
  @WebSocketServer()
  socket: Server;

  @OnEvent(NotificationType.SUBJECT_DELETED)
  send() {
    this.socket.send('coucou', 'oucoucoucou');
  }
}
