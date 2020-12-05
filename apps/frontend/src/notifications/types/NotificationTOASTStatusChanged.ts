import Notification from './Notification';

import { ToastStatus } from '@letsshareatoast/shared';

interface NotificationTOASTStatusChanged extends Notification {
  status: ToastStatus;
}

export default NotificationTOASTStatusChanged;
