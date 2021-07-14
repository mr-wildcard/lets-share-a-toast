import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Not, Repository } from 'typeorm';

import { SubjectsVotes, ToastStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { Subject } from 'api/subjects/entities/subject.entity';
import { Toast } from './entities/toast.entity';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { UpdateToastStatusDto } from './dto/update-toast-status.dto';
import { getSubjectTotalVotes } from './helpers/votes';

@Injectable()
export class ToastsService {
  constructor(
    @InjectRepository(Toast)
    private readonly toastsRepository: Repository<Toast>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>
  ) {}

  async create(input: CreateToastDto) {
    const toast = new Toast();
    toast.date = input.date;
    toast.status = input.status;
    toast.organizer = await this.usersRepository.findOne(input.organizerId);
    toast.scribe = await this.usersRepository.findOne(input.scribeId);

    return this.toastsRepository.save(toast);
  }

  findOneByStatus(status: ToastStatus) {
    return this.toastsRepository.findOne({
      where: {
        status: Equal(status),
      },
    });
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

  async setSelectedSubjects(currentToast: Toast, selectedSubjectIds: string[]) {
    currentToast.selectedSubjects = await this.subjectRepository.findByIds(
      selectedSubjectIds
    );

    return this.toastsRepository.save(currentToast);
  }

  async setVotesResults(currentToast: Toast, votes: SubjectsVotes) {
    /**
     * At the end of a voting session, Firebase returns the data
     * showing who voted for which subject. This is useful on backend side,
     * but on frontend side we don't care so we anonymize the data by removing the user ids.
     */
    currentToast.votes = Object.entries(votes).reduce(
      (anonymizedVotes, [subjectId, subjectVotes]) => {
        anonymizedVotes[subjectId] = getSubjectTotalVotes(subjectVotes);

        return anonymizedVotes;
      },
      {}
    );

    return this.toastsRepository.save(currentToast);
  }

  updateCurrentToastStatus(currentToast: Toast, input: UpdateToastStatusDto) {
    currentToast.status = input.status;

    return this.toastsRepository.update(currentToast.id, input);
  }
}
