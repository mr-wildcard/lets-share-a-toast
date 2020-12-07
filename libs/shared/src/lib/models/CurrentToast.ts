import { HttpError } from './HttpError';
import { Toast } from './Toast';

/**
 * The API endpoint used to retrieve the current toast (`/toasts/current`),
 * can return both a 404 HTTP response with an `ErrorBody` if there is
 * no ongoing session and a Toast DTO if a session is live
 */
export type CurrentToast = HttpError<404> | Toast;
