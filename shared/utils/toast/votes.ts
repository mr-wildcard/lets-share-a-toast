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

export function getSelectedSubjectIds(
  subjectsVotes: SubjectsVotes,
  maxSelectableSubjects: number
) {
  const allSubjectIds = Object.keys(subjectsVotes);

  const allTotalVotes = [];
  const dictionaryOfSubjectPerTotalVotes: DictionaryOfSubjectPerTotalVotes = {};

  for (let i = 0; i < allSubjectIds.length; i++) {
    const subjectId = allSubjectIds[i];
    const subjectTotalVotes = getSubjectTotalVotes(subjectsVotes[subjectId]);

    allTotalVotes.push(subjectTotalVotes);

    if (!dictionaryOfSubjectPerTotalVotes[subjectTotalVotes]) {
      dictionaryOfSubjectPerTotalVotes[subjectTotalVotes] = [];
    }

    dictionaryOfSubjectPerTotalVotes[subjectTotalVotes].push(subjectId);
  }

  const allUniqueTotalVotes = Array.from(new Set(allTotalVotes));

  const descOrderedTotalVotes = allUniqueTotalVotes.sort().reverse();

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
