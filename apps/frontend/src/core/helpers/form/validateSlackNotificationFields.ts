import SlackNotificationFieldsValues from 'frontend/core/models/form/SlackNotificationFieldsValues';

export default function slackNotificationFieldsAreValid<
  T extends SlackNotificationFieldsValues
>(values: T) {
  return (
    !values.notifySlack ||
    (values.notifySlack && values.notificationMessage.length > 0)
  );
}
