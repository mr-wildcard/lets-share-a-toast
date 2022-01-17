import dayjs from "dayjs";

export const isSubjectNew = (subjectCreationDate: Date) => {
  return dayjs(subjectCreationDate).isAfter(dayjs().subtract(2, "week"));
};

export const isSubjectPrettyOld = (subjectCreationDate: Date) => {
  return dayjs(subjectCreationDate).isBefore(dayjs().subtract(3, "month"));
};
