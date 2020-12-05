import { User } from './User';

interface Voter {
  [profileId: string]: User;
}

export interface FirebaseVotingSession {
  [subjectId: string]: Voter[];
}
