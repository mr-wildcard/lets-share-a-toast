import io, { Socket, Manager } from "socket.io-client";

import { WebSocketNamespaces } from "@shared/enums";

const manager = new Manager(import.meta.env.VITE_API_URL as string, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
});

export const getNotificationSocket = () =>
  manager.socket("/" + WebSocketNamespaces.NOTIFICATIONS);

export const getVotingSessionSocket = () =>
  manager.socket("/" + WebSocketNamespaces.VOTING_SESSION);
