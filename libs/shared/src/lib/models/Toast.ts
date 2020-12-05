import { ToastStatus } from '../enums/ToastStatus';
import { Subject } from './Subject';
import { User } from './User';
import { Vote } from './Vote';

export interface Toast {
  id: string;
  date: string;
  number: number;
  organizer: User;
  scribe: User;
  status: ToastStatus;
  subjects: Subject[];
  selectedSubjects: Subject[];
  votes: Vote[];
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
