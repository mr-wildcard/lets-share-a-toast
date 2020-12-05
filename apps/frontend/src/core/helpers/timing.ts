import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function getTOASTRemainingDays(toastDate: Date) {
  // TODO: remove `.hour(14)` once API accept custom hour.
  return dayjs(toastDate).hour(14).fromNow();
}

export function getFormattedTOASTDate(
  toastDate: Date,
  format = 'dddd, MMMM DD YYYY'
) {
  // TODO: remove `.hour(14)` once API accept custom hour.
  return dayjs(toastDate).hour(14).format(format);
}

export function getTOASTElapsedTimeSinceCreation(creationDate: Date) {
  // TODO: remove `.hour(14)` once API accept custom hour.
  return dayjs(creationDate).fromNow();
}

export function getFormattedTOASTDateWithRemainingDays(toastDate: Date) {
  return `${getFormattedTOASTDate(
    toastDate
  )} (${getTOASTElapsedTimeSinceCreation(toastDate)})`;
}

export function isTOASTToday(toastDate: Date) {
  // TODO: remove `.hour(14)` once API accept custom hour.
  return dayjs(toastDate).hour(14).isSame(new Date(), 'day');
}

export function hasTOASTDatePassed(toastDate: Date) {
  // TODO: remove `.hour(14)` once API accept custom hour.
  return dayjs(toastDate).hour(14).isBefore(new Date(), 'day');
}
