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
  organizerId: string;

  @IsNotEmpty()
  @IsString()
  scribeId: string;

  @IsOptional()
  @IsEnum(ToastStatus)
  status: ToastStatus;
}
