import { Subject } from './Subject';
import { User } from './User';

export interface FirebaseVotingSessionSubject extends Subject {
  voters: User[];
}
