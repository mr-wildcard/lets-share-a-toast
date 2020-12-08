import { URLQueryParams } from '@letsshareatoast/shared';

/**
 * Returns an URL similar to : /api/whatever/path?slackNotificationMessage=Hello%40Hello
 * @param apiPath
 * @param slackMessage
 */
export default function getAPIEndpointWithSlackNotification(
  apiPath: string,
  slackMessage: string
): string {
  const queryParams = new URLSearchParams();

  queryParams.set(URLQueryParams.NOTIFY_SLACK_MESSAGE, slackMessage);

  return `${apiPath}?${queryParams.toString()}`;
}
