import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ToastStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { Toast } from './entities/toast.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { UpdateToastStatusDto } from 'api/toasts/dto/update-toast-status.dto';

@Injectable()
export class ToastsService {
  constructor(
    @InjectRepository(Toast)
    private readonly toastsRepository: Repository<Toast>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(input: CreateToastDto) {
    const toast = new Toast();
    toast.date = input.date;
    toast.status = input.status;
    toast.organizer = await this.usersRepository.findOne(input.organizerId);
    toast.scribe = await this.usersRepository.findOne(input.scribeId);

    return this.toastsRepository.save(toast);
  }

  findCurrentToast() {
    return this.toastsRepository.findOne({
      where: {
        status: Not(In([ToastStatus.CLOSED, ToastStatus.CANCELLED])),
      },
    });
  }

  async updateCurrentToast(currentToast: Toast, input: UpdateToastDto) {
    currentToast.date = input.date || currentToast.date;

    if (input.organizerId !== currentToast.organizer.id) {
      currentToast.organizer = await this.usersRepository.findOne(
        input.organizerId
      );
    }

    if (input.scribeId !== currentToast.scribe.id) {
      currentToast.scribe = await this.usersRepository.findOne(input.scribeId);
    }

    return this.toastsRepository.save(currentToast);
  }

  updateCurrentToastStatus(currentToast: Toast, input: UpdateToastStatusDto) {
    currentToast.status = input.status;

    return this.toastsRepository.save(currentToast);
  }
}
