import {
  DatabaseVotingSession,
  SubjectsVotes,
  SubjectVote,
} from "@shared/firebase";

/**
 * Check if the voting session object has at least one vote
 * whatever the subject it is.
 */
export function votingSessionHasAtLeastOneVote(
  votingSession: DatabaseVotingSession
) {
  return Object.keys(votingSession?.votes ?? {}).length > 0;
}

export function getSubjectTotalVotes(subject: SubjectVote) {
  const allVotes = Object.values(subject);

  let totalVotes = 0;
  for (let vote in allVotes) {
    totalVotes += allVotes[vote];
  }

  return totalVotes;
}

interface DictionaryOfSubjectPerTotalVotes {
  [totalVotes: number]: string[];
}

export function getDictionaryOfSubjectPerTotalVotes(
  subjectsVotes: SubjectsVotes
) {
  const allSubjectIds = Object.keys(subjectsVotes);

  const dictionaryOfSubjectPerTotalVotes: DictionaryOfSubjectPerTotalVotes = {};

  for (let i = 0; i < allSubjectIds.length; i++) {
    const subjectId = allSubjectIds[i];
    const subjectTotalVotes = getSubjectTotalVotes(subjectsVotes[subjectId]);

    dictionaryOfSubjectPerTotalVotes[subjectTotalVotes] ??= [];
    dictionaryOfSubjectPerTotalVotes[subjectTotalVotes].push(subjectId);
  }

  return dictionaryOfSubjectPerTotalVotes;
}

/**
 * Return an array of numbers representing all unique total votes
 * of all subjects from voting session.
 */
export function getAllUniqueTotalVotes(subjectsVotes: SubjectsVotes) {
  const allSubjectIds = Object.keys(subjectsVotes);

  /**
   * Array holding all total votes of all subjects
   */
  const allUniqueTotalVotes: number[] = [];

  for (let i = 0; i < allSubjectIds.length; i++) {
    const subjectId = allSubjectIds[i];
    const subjectTotalVotes = getSubjectTotalVotes(subjectsVotes[subjectId]);

    if (!allUniqueTotalVotes.includes(subjectTotalVotes)) {
      allUniqueTotalVotes.push(subjectTotalVotes);
    }
  }

  return allUniqueTotalVotes;
}

export function getSelectedSubjectIds(
  subjectsVotes: SubjectsVotes,
  maxSelectableSubjects: number
) {
  /**
   * For performance sake we will store in this object subjects paired to their total votes.
   * Data structure is as follow:
   * [key]: total votes
   * [value]: array of subject ids having this total of votes.
   *
   * This object will allow later to easily find subjects having the given total votes.
   */
  const dictionaryOfSubjectPerTotalVotes =
    getDictionaryOfSubjectPerTotalVotes(subjectsVotes);

  /**
   * Array holding all total votes of all subjects
   */
  const allUniqueTotalVotes = getAllUniqueTotalVotes(subjectsVotes);

  /*
   * Sort the array of total votes in descendant order.
   */
  const descOrderedTotalVotes = allUniqueTotalVotes.sort().reverse();

  /**
   * Loop over all total votes then fill the final array of selected subjects
   * until it reaches the `maxSelectableSubjects` parameter.
   */
  const selectedSubjects = [];
  for (let i = 0; i < descOrderedTotalVotes.length; i++) {
    const currentTotalVotes = descOrderedTotalVotes[i];

    selectedSubjects.push(
      ...dictionaryOfSubjectPerTotalVotes[currentTotalVotes]
    );

    if (selectedSubjects.length >= maxSelectableSubjects) {
      break;
    }
  }

  return selectedSubjects;
}

export function getUserTotalVotes(
  userId: string,
  subjectsVotes?: SubjectsVotes
) {
  if (!subjectsVotes) {
    return 0;
  }

  let userTotalVotes = 0;

  const votedSubject = Object.entries(subjectsVotes);

  for (let i = 0; i < votedSubject.length; i++) {
    const [subjectId, subjectVotes] = votedSubject[i];

    if (userId in subjectVotes) {
      userTotalVotes += subjectVotes[userId];
    }
  }

  return userTotalVotes;
}
