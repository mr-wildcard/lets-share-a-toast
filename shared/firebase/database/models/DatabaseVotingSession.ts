type VoterTotalVotes = number;
type SubjectTotalVotes = number;

export interface SubjectVote {
  [voter: string]: VoterTotalVotes;
}

export interface SubjectsVotes {
  [subjectId: string]: SubjectVote;
}

export interface DatabaseVotingSession {
  peopleCanVote: boolean;
  votes: SubjectsVotes;
}

/**
 * Used on frontend side to anonymize who voted for which subject.
 */
export interface SubjectsTotalVotes {
  [subjectId: string]: SubjectTotalVotes;
}
