import { SlackNotificationFieldsValues } from "@web/core/models/form/SlackNotificationFieldsValues";

export function validateSlackNotificationField(
  values: SlackNotificationFieldsValues
) {
  return (
    !values.notifySlack ||
    (values.notifySlack && values.notificationMessage.length > 0)
  );
}
