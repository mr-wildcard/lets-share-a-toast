export interface HttpError<T extends number> {
  error: string;
  message: string | string[];
  statusCode: T;
}
