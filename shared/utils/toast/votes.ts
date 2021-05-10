import { SubjectVote } from "@shared/firebase";

export function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);
}
