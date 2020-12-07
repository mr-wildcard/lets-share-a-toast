import { OmitType } from '@nestjs/mapped-types';

import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends OmitType(CreateSubjectDto, [
  'status',
] as const) {}
