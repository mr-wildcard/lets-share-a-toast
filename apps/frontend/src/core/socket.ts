import { io } from 'socket.io-client';

export default function getSocket() {
  return io(process.env.REAL_TIME_APP_BASE_URL, {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 5000,
    reconnectionDelayMax: 5000,
  });
}
