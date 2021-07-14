import { DatabaseVotingSession, SubjectVote } from "@shared/firebase";

/**
 * Check if the voting session object has at least one vote
 * whatever the subject it is.
 */
export function votingSessionHasAtLeastOneVote(
  votingSession: DatabaseVotingSession
) {
  return Object.keys(votingSession?.votes ?? {}).length > 0;
}

export function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);
}
