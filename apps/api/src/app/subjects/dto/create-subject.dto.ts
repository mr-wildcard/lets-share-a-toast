import {
  ArrayNotEmpty,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { SubjectStatus, SubjectLanguage } from '@letsshareatoast/shared';

export class CreateSubjectDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly speakers: string[];

  @IsEnum(SubjectStatus)
  readonly status: SubjectStatus;

  @IsEnum(SubjectLanguage)
  readonly language: SubjectLanguage;

  @IsPositive()
  readonly duration: number;

  @IsOptional()
  @IsString()
  readonly comment: string;

  @IsOptional()
  @IsString()
  readonly cover: string;
}
