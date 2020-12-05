import { IsEnum } from 'class-validator';

import { SubjectStatus } from '@letsshareatoast/shared';

export class UpdateSubjectStatusDto {
  @IsEnum(SubjectStatus)
  readonly status: SubjectStatus;
}
