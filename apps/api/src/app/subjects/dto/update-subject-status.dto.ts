import { PickType } from '@nestjs/mapped-types';

import { CreateSubjectDto } from 'api/subjects/dto/create-subject.dto';

export class UpdateSubjectStatusDto extends PickType(CreateSubjectDto, [
  'status',
] as const) {}
