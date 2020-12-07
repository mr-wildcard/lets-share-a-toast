import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { ToastStatus, getTOASTStatusUtils } from '@letsshareatoast/shared';

import { NotFoundInterceptor } from 'api/interceptors/NotFound';
import { toastStatusMachine } from 'api/state-machines/toast';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { ToastsService } from './toasts.service';

@Controller('toasts')
@UseInterceptors(NotFoundInterceptor)
export class ToastsController {
  constructor(private readonly toastsService: ToastsService) {}

  @Post()
  async create(@Body() createToastDto: CreateToastDto) {
    const currentToast = await this.toastsService.findCurrentToast();

    if (currentToast) {
      throw new ForbiddenException(
        'A TOAST is already opened. You need to close or cancel it first before creating a new one.'
      );
    } else {
      return this.toastsService.create(createToastDto);
    }
  }

  @Get('current')
  async getCurrentToast() {
    const currentToast = await this.toastsService.findCurrentToast();

    if (!currentToast) {
      throw new NotFoundException('No TOAST is currently opened.');
    } else {
      return currentToast;
    }
  }

  @Put('current')
  async update(@Body() updateToastDto: UpdateToastDto) {
    const currentToast = await this.toastsService.findCurrentToast();

    if (!currentToast) {
      throw new ForbiddenException(
        `There is no ongoing TOAST to update. You need to create a new one.`
      );
    } else {
      const toastStatusUtils = getTOASTStatusUtils(currentToast.status);

      if (!toastStatusUtils.isAllowed(updateToastDto.status)) {
        throw new BadRequestException(
          `Incorrect TOAST status. Status should either be ${toastStatusUtils.getNextAllowedStatus()} or ${
            ToastStatus.CANCELLED
          }`
        );
      } else {
        return this.toastsService.updateCurrentToast(
          currentToast,
          updateToastDto
        );
      }
    }
  }
}
