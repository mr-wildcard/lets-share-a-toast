import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import {
  ToastStatus,
  getTOASTStatusUtils,
  URLQueryParams,
} from '@letsshareatoast/shared';

import { SlackNotificationsInterceptor } from 'api/interceptors/slack-notifications.interceptor';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { ToastsService } from './toasts.service';
import { UpdateToastStatusDto } from './dto/update-toast-status.dto';

@Controller('toasts')
export class ToastsController {
  constructor(private readonly toastsService: ToastsService) {}

  @Post()
  @UseInterceptors(SlackNotificationsInterceptor)
  async create(@Body() input: CreateToastDto) {
    const currentToast = await this.toastsService.findCurrentToast();

    if (currentToast) {
      throw new ForbiddenException(
        'A TOAST is already opened. You need to close or cancel it first before creating a new one.'
      );
    } else {
      return this.toastsService.create(input);
    }
  }

  @Get('current')
  async getCurrentToast() {
    const currentToast = await this.toastsService.findCurrentToast();

    if (!currentToast) {
      throw new NotFoundException('No current TOAST found.');
    }

    return currentToast;
  }

  @Put('current')
  async updateCurrentToast(@Body() input: UpdateToastDto) {
    const currentToast = await this.getCurrentToast();

    return this.toastsService.updateCurrentToast(currentToast, input);
  }

  @Put('current/status')
  @UseInterceptors(SlackNotificationsInterceptor)
  async updateCurrentToastStatus(@Body() input: UpdateToastStatusDto) {
    const currentToast = await this.getCurrentToast();
    const toastStatusUtils = getTOASTStatusUtils(currentToast.status);

    if (!toastStatusUtils.isAllowed(input.status)) {
      throw new BadRequestException(
        `Incorrect TOAST status. Status should either be ${toastStatusUtils.getNextAllowedStatus()} or ${
          ToastStatus.CANCELLED
        }`
      );
    } else {
      return this.toastsService.updateCurrentToastStatus(currentToast, input);
    }
  }
}
