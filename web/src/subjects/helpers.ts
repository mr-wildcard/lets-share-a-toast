import dayjs from 'dayjs';

export const isSubjectNew = (subjectCreationDate: string) => {
  const creationDate = dayjs(subjectCreationDate);

  return creationDate.isAfter(dayjs().subtract(2, 'week'));
};
