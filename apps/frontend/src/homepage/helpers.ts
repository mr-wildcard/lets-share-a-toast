import { Toast } from '@letsshareatoast/shared';

import { getFormattedTOASTDateWithRemainingDays } from 'frontend/core/helpers/timing';
import getUserFullname from 'frontend/core/helpers/getUserFullname';

export const getTOASTIsReadySlackMessage = (toast: Toast) => {
  const listOfSubjects =
    toast.subjects
      ?.map(
        (subject) =>
          `- "_${subject.title}_" *presented by* ${subject.speakers.map(
            getUserFullname
          )}.`
      )
      .join('\n') ?? '';

  return `@here 🍞 TOAST 🍞\nVotes are now closed. Thank you all for your participation! We'll have the pleasure to see :\n\n${listOfSubjects}\n\nNext TOAST is scheduled for *${getFormattedTOASTDateWithRemainingDays(
    new Date(toast.date)
  )}*`;
};
