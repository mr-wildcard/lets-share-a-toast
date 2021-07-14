import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SubjectStatus, ToastStatus } from '@letsshareatoast/shared';

import { NotificationType } from 'api/enums/NotificationType';
import { ToastsService } from 'api/toasts/toasts.service';
import { VotingSessionService } from 'api/firebase/voting-session.service';
import { Subject } from './entities/subject.entity';
import { UpdateSubjectStatusDto } from './dto/update-subject-status.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly toastsService: ToastsService,
    private readonly firestoreVotingSessionService: VotingSessionService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @Post()
  async create(@Body() input: CreateSubjectDto) {
    const createdSubject = await this.subjectsService.create(input);

    const currentToastOpenToVotes = await this.toastsService.findOneByStatus(
      ToastStatus.OPEN_FOR_VOTE
    );

    if (currentToastOpenToVotes) {
      await this.firestoreVotingSessionService.addSubject(
        currentToastOpenToVotes.id,
        createdSubject.id
      );
    }

    /**
     * Emit event about the creation
     */
    this.eventEmitter.emit(NotificationType.SUBJECT_CREATED);

    return createdSubject;
  }

  @Get(':id')
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const subject = await this.subjectsService.findOne(id);

    if (!subject) {
      throw new NotFoundException("Subject doesn't exist.");
    }

    return this.subjectsService.findOne(id);
  }

  @Get()
  findAll(@Query('id') ids?: string[]) {
    return this.subjectsService.findAll(ids);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateSubjectStatusDto
  ) {
    const subject = await this.find(id);

    const currentToastOpenToVotes = await this.toastsService.findOneByStatus(
      ToastStatus.OPEN_FOR_VOTE
    );

    if (currentToastOpenToVotes) {
      this.toggleSubjectCurrentVotingSession(
        currentToastOpenToVotes.id,
        subject,
        input
      );
    }

    /**
     * Emit event about the status update
     */
    this.eventEmitter.emit(NotificationType.SUBJECT_STATUS_CHANGED);

    return this.subjectsService.updateStatus(subject, input);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateSubjectDto
  ) {
    const subject = await this.find(id);

    const currentToastOpenToVotes = await this.toastsService.findOneByStatus(
      ToastStatus.OPEN_FOR_VOTE
    );

    if (currentToastOpenToVotes) {
      this.toggleSubjectCurrentVotingSession(
        currentToastOpenToVotes.id,
        subject,
        input
      );
    }

    const updatedSubject = await this.subjectsService.update(subject, input);

    /**
     * Emit event about the update
     */
    this.eventEmitter.emit(NotificationType.SUBJECT_UPDATED);

    return updatedSubject;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) subjectId: string) {
    const result = await this.subjectsService.remove(subjectId);

    /**
     * Emit event about the deletion
     */
    this.eventEmitter.emit(NotificationType.SUBJECT_DELETED);

    const currentToastOpenToVotes = await this.toastsService.findOneByStatus(
      ToastStatus.OPEN_FOR_VOTE
    );

    if (currentToastOpenToVotes) {
      this.firestoreVotingSessionService.deleteSubject(
        currentToastOpenToVotes.id,
        subjectId
      );
    }

    return result;
  }

  /**
   * Add or remove subject from current voting session on Firebase.
   * @param currentToastId
   * @param oldSubject
   * @param updateInput
   */
  toggleSubjectCurrentVotingSession(
    currentToastId: string,
    oldSubject: Subject,
    updateInput: UpdateSubjectStatusDto | UpdateSubjectDto
  ) {
    /**
     * If subject status went from available to any other status and a current TOAST voting session is opened,
     * this subject is probably in the voting session of Firebase and need to be removed from it.
     */
    if (
      oldSubject.status === SubjectStatus.AVAILABLE &&
      updateInput.status !== SubjectStatus.AVAILABLE
    ) {
      return this.firestoreVotingSessionService.deleteSubject(
        currentToastId,
        oldSubject.id
      );
    } else if (
      /**
       * If subject wasn't available and its status changed to a suitable status for the voting session,
       * we need to add it to the ongoing voting session on Firebase.
       */
      oldSubject.status !== SubjectStatus.AVAILABLE &&
      updateInput.status === SubjectStatus.AVAILABLE
    ) {
      return this.firestoreVotingSessionService.addSubject(
        currentToastId,
        oldSubject.id
      );
    }
  }
}
