type VoterTotalVotes = number;
type SubjectTotalVotes = number;
type SubjectID = string;

export interface SubjectVote {
  [voter: string]: VoterTotalVotes;
}

export interface SubjectsVotes {
  [subjectId: string]: SubjectVote;
}

export interface DatabaseVotingSession {
  peopleCanVote: boolean;
  selectedSubjects: SubjectID[];
  votes?: SubjectsVotes;
}

/**
 * Used on frontend side to anonymize who voted for which subject.
 */
export interface SubjectsTotalVotes {
  [subjectId: string]: SubjectTotalVotes;
}
