import { Toast } from './Toast';
import { Subject } from './Subject';

export interface Vote {
  id: string;
  session: Toast;
  subject: Subject;
  userId: string;
}
