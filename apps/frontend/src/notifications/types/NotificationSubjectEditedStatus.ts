import Notification from './Notification';

interface NotificationSubjectEditedStatus extends Notification {
  subjectTitle: string;
  newStatus: string;
}

export default NotificationSubjectEditedStatus;
