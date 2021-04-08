import { SubjectsVotes, SubjectVote } from '@letsshareatoast/shared';

import {
  getSubjectTotalVotes,
  getAllTotalVotesFromAllSubjects,
  getSelectedSubjectsIds,
} from './votes';

describe('getSubjectTotalVotes', () => {
  test('should total number of votes for one subject', () => {
    // GIVEN
    const subjectVotes: SubjectVote = {
      voter_1: 3,
      voter_2: 2,
    };

    // THEN
    expect(getSubjectTotalVotes(subjectVotes)).toBe(5);
  });

  test('should return 0 because no one voted for this subject :(', () => {
    // GIVEN
    const subjectVotes: SubjectVote = {};

    // THEN
    expect(getSubjectTotalVotes(subjectVotes)).toBe(0);
  });
});

describe('getAllTotalVotesFromAllSubjects', () => {
  // GIVEN
  const subjectsVotes: SubjectsVotes = {
    subject_id_1: {
      voter_1: 1,
      voter_2: 2,
      voter_3: 1,
    },
    subject_id_2: {
      voter_1: 1,
    },
    subject_id_3: {},
    subject_id_4: {
      voter_1: 3,
      voter_2: 2,
    },
  };

  test('should return an array of numbers greater than 0', () => {
    // THEN
    expect(getAllTotalVotesFromAllSubjects(subjectsVotes)).toEqual([4, 1, 5]);
  });
});

describe('getSelectedSubjectsIds', () => {
  test('should return ids of subjects having enough votes to be selected at the end of the voting session', () => {
    // GIVEN
    const subjectsVotes: SubjectsVotes = {
      subject_id_1: {
        voter_1: 1,
        voter_2: 2,
        voter_3: 1,
      },
      subject_id_2: {
        voter_1: 1,
      },
      subject_id_3: {},
      subject_id_4: {
        voter_1: 3,
        voter_2: 2,
      },
    };

    const totalVotesSubjectsMustHave = [5, 4];

    // THEN
    expect(
      getSelectedSubjectsIds(subjectsVotes, totalVotesSubjectsMustHave)
    ).toEqual(['subject_id_1', 'subject_id_4']);

    /** BECAUSE :
     *
     * We want to all subjects with exactly 5 votes (could be one)
     * then all subjects with 4 votes (could also be one).
     */
  });
});
