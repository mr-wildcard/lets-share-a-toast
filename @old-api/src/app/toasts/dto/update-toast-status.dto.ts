import { ArrayNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator';

import { ToastStatus } from '@letsshareatoast/shared';

export class UpdateToastStatusDto {
  @IsEnum(ToastStatus)
  status: ToastStatus;

  @IsOptional()
  @IsString({ each: true })
  selectedSubjectsIds: string[];
}
