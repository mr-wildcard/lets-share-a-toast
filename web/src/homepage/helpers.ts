import { Toast } from "@shared/models";

import { getFormattedTOASTDateWithRemainingDays } from "@web/core/helpers/timing";
import getUserFullname from "@web/core/helpers/getUserFullname";

export const getTOASTIsReadySlackMessage = (toast: Toast) => {
  const listOfSubjects = toast.selectedSubjects
    .map(
      (subject) =>
        `- "_${subject.title}_" presented by *${subject.speakers
          .map(getUserFullname)
          .join(", ")}*.`
    )
    .join("\n");

  return `@here 🍞 TOAST 🍞\nVotes are now closed. Thank you all for your participation! We'll have the pleasure to see :\n\n${listOfSubjects}\n\nNext TOAST is scheduled for *${getFormattedTOASTDateWithRemainingDays(
    new Date(toast.date)
  )}*`;
};
