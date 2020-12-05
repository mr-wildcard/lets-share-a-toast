import { Toast, CurrentToast } from '@letsshareatoast/shared';

/**
 * This is a TypeScript custom type guard. It's value can't be assigned to a variable
 * and need to be used everytime we need to test a Toast object.
 *
 * The API endpoint used to retrieve the current toast (`/toasts/current`),
 * can return both a 404 HTTP response with an `ErrorBody` if there is
 * no ongoing toast and a Toast DTO if a toast is live.
 * This can be a source of error prone code and we definitely need
 * an helper to crack this point.
 * @param currentToast
 */
export default function isToast(
  currentToast?: CurrentToast
): currentToast is Toast {
  return (
    !!currentToast &&
    'date' in (currentToast as Toast) &&
    'status' in (currentToast as Toast)
  );
}
