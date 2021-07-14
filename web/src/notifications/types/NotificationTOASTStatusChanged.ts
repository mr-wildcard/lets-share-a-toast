import Notification from "./Notification";

import { ToastStatus } from "@shared/enums";

interface NotificationTOASTStatusChanged extends Notification {
  status: ToastStatus;
}

export default NotificationTOASTStatusChanged;
