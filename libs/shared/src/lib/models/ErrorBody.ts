import { APIErrorCodes } from './Errors';

export interface ErrorBody {
  code: APIErrorCodes;
  message: string;
}
