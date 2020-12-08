import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubjectStatus } from '@letsshareatoast/shared';

import { User } from 'api/users/entities/user.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectStatusDto } from 'api/subjects/dto/update-subject-status.dto';

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

  findOne(id: string) {
    return this.subjectsRepository.findOne(id);
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

  async update(subject: Subject, input: UpdateSubjectDto) {
    subject.title = input.title || subject.title;
    subject.description = input.description || subject.description;
    subject.status = input.status || subject.status;
    subject.comment = input.comment || subject.comment;
    subject.cover = input.cover || subject.cover;
    subject.duration = input.duration || subject.duration;
    subject.language = input.language || subject.language;

    if (input.speakers) {
      subject.speakers = await this.usersRepository.findByIds(input.speakers);
    }

    return this.subjectsRepository.save(subject);
  }

  updateStatus(subject: Subject, input: UpdateSubjectStatusDto) {
    subject.status = input.status || subject.status;

    return this.subjectsRepository.save(subject);
  }

  remove(id: string) {
    return this.subjectsRepository.delete(id);
  }
}
