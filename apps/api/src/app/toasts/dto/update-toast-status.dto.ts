import { IsEnum, IsOptional } from 'class-validator';

import { ToastStatus } from '@letsshareatoast/shared';

export class UpdateToastStatusDto {
  @IsEnum(ToastStatus)
  status: ToastStatus;
}
