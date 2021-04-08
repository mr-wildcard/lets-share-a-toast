import { SubjectsVotes, SubjectVote } from '@letsshareatoast/shared';

/**
 * @param votedSubject
 * @return Sum of all votes from a subject
 */
export function getSubjectTotalVotes(votedSubject: SubjectVote) {
  const allVotes = Object.values(votedSubject);

  return allVotes.reduce((totalVotes, votePerUser) => {
    return totalVotes + votePerUser;
  }, 0);
}

/**
 * @param votedSubjects
 * @return Array of numbers representing all total votes per subjects
 */
export function getAllTotalVotesFromAllSubjects(votedSubjects: SubjectsVotes) {
  return Object.values(votedSubjects)
    .map(getSubjectTotalVotes)
    .filter((totalVotes) => totalVotes > 0);
}

/**
 * @param votedSubjects
 * @param totalVotesSubjectsMustHave
 * @return Array of subject ids matching the amount of votes required
 */
export function getSelectedSubjectsIds(
  votedSubjects: SubjectsVotes,
  totalVotesSubjectsMustHave: number[]
) {
  return Object.entries(votedSubjects).reduce(
    (subjectIds, [subjectId, subjectVotes]) => {
      const subjectTotalVotes = getSubjectTotalVotes(subjectVotes);

      if (totalVotesSubjectsMustHave.includes(subjectTotalVotes)) {
        subjectIds.push(subjectId);
      }

      return subjectIds;
    },
    []
  );
}
