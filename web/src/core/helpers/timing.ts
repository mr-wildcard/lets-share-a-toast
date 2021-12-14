import dayjs from "dayjs";

export function getTOASTRemainingDays(toastDate: Date) {
  return dayjs(toastDate).fromNow();
}

export function getTOASTElapsedTimeSinceCreation(creationDate: Date) {
  return dayjs(creationDate).fromNow();
}

export function getFormattedTOASTDateWithRemainingDays(toastDate: Date) {
  const formattedTOASTDate = dayjs(toastDate).format(
    "dddd, MMMM DD YYYY [at] HH:mm"
  );
  const formattedElapsedTime = getTOASTElapsedTimeSinceCreation(toastDate);

  return `${formattedTOASTDate} (${formattedElapsedTime})`;
}

export function isTOASTToday(toastDate: Date) {
  return dayjs(toastDate).isSame(new Date(), "day");
}

export function hasTOASTDatePassed(toastDate: Date) {
  return dayjs(toastDate).isBefore(new Date(), "day");
}
