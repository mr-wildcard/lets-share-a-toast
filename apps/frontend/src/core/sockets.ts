import io, { Socket, Manager } from 'socket.io-client';

import { WebSocketNamespaces } from '@letsshareatoast/shared';

const manager = new Manager(process.env.NEXT_PUBLIC_API_URL, {
  reconnectionDelayMax: 10000,
  transports: ['websocket'],
});

export const getNotificationSocket = () =>
  manager.socket('/' + WebSocketNamespaces.NOTIFICATIONS);

export const getVotingSessionSocket = () =>
  manager.socket('/' + WebSocketNamespaces.VOTING_SESSION);
