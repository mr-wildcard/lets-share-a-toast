import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ToastStatus } from '@letsshareatoast/shared';

export class UpdateToastDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  organizerId: string;

  @IsNotEmpty()
  @IsString()
  scribeId: string;
}
