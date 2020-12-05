import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubjectStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(input: CreateSubjectDto) {
    const newSubject = new Subject();
    newSubject.title = input.title;
    newSubject.description = input.description;
    newSubject.status = input.status;
    newSubject.comment = input.comment;
    newSubject.cover = input.cover;
    newSubject.language = input.language;
    newSubject.duration = input.duration;
    newSubject.speakers = await this.usersRepository.findByIds(input.speakers);

    return this.subjectsRepository.save(newSubject);
  }

  findOneOrFail(id: number) {
    return this.subjectsRepository.findOneOrFail(id);
  }

  findAll() {
    return this.subjectsRepository.find();
  }

  findAllByStatus(status: SubjectStatus) {
    return this.subjectsRepository.find({
      where: {
        status,
      },
    });
  }

  async update(id: number, input: UpdateSubjectDto) {
    const subject = await this.findOneOrFail(id);

    subject.title = input.title || subject.title;
    subject.description = input.description || subject.description;
    subject.comment = input.comment || subject.comment;
    subject.cover = input.cover || subject.cover;
    subject.status = input.status || subject.status;
    subject.duration = input.duration || subject.duration;
    subject.language = input.language || subject.language;

    if (input.speakers) {
      subject.speakers = await this.usersRepository.findByIds(input.speakers);
    }

    return this.subjectsRepository.save(subject);
  }

  remove(id: number) {
    return this.subjectsRepository.delete(id);
  }
}
