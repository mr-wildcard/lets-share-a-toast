import Notification from './Notification';

import { ToastStatus } from '@shared';

interface NotificationTOASTStatusChanged extends Notification {
  status: ToastStatus;
}

export default NotificationTOASTStatusChanged;
