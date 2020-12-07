import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ToastStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { Toast } from './entities/toast.entity';

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

  async updateCurrentToast(toast: Toast, input: UpdateToastDto) {
    toast.date = input.date || toast.date;
    toast.status = input.status || toast.status;

    if (input.organizerId !== toast.organizer.id) {
      toast.organizer = await this.usersRepository.findOne(input.organizerId);
    }

    if (input.scribeId !== toast.scribe.id) {
      toast.scribe = await this.usersRepository.findOne(input.scribeId);
    }

    return this.toastsRepository.save(toast);
  }
}
