import { ErrorBody } from './ErrorBody';
import { Toast } from './Toast';

/**
 * The API endpoint used to retrieve the current session (`/sessions/current`),
 * can return both a 404 HTTP response with an `ErrorBody` if there is
 * no ongoing session and a Toast DTO if a session is live
 */
export type CurrentToast = ErrorBody | Toast;
