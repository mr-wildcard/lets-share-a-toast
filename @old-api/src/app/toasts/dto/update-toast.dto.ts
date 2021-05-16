import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

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
