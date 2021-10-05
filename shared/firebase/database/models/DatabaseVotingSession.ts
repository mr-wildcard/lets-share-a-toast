type UserTotalVotes = number;
type SubjectTotalVotes = number;
type SubjectID = string;

export interface SubjectVote {
  [userId: string]: UserTotalVotes;
}

export interface SubjectsVotes {
  [subjectId: string]: SubjectVote;
}

export interface VotingSession {
  votes?: SubjectsVotes;
}

export type DatabaseVotingSession = null | VotingSession;

/**
 * Used on frontend side to anonymize who voted for which subject.
 */
export interface SubjectsTotalVotes {
  [subjectId: string]: SubjectTotalVotes;
}
