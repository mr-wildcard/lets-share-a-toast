import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { ToastStatus } from '@letsshareatoast/shared';

export class CreateToastDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  organizer: string;

  @IsNotEmpty()
  @IsString()
  scribe: string;

  @IsOptional()
  @IsEnum(ToastStatus)
  status: ToastStatus;
}
