import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  MessageEvent,
  NotFoundException,
  Post,
  Put,
  Sse,
  UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { concat, from, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';

import {
  FirebaseVotingSessionDocument,
  getTOASTStatusUtils,
  SubjectStatus,
  ToastStatus,
  unique,
} from '@letsshareatoast/shared';

import { SlackNotificationsInterceptor } from 'api/interceptors/slack-notifications.interceptor';
import { VotingSessionService } from 'api/firebase/voting-session.service';
import { SubjectsService } from 'api/subjects/subjects.service';
import { CreateToastDto } from './dto/create-toast.dto';
import { UpdateToastDto } from './dto/update-toast.dto';
import { UpdateToastStatusDto } from './dto/update-toast-status.dto';
import { ToastsService } from './toasts.service';
import { Toast } from './entities/toast.entity';
import { ToastEntityEvents } from './enums/ToastEntityEvents';
import {
  getAllTotalVotesFromAllSubjects,
  getSelectedSubjectsIds,
} from 'api/toasts/helpers/votes';
import { UpdateToastSelectedSubjectsDto } from 'api/toasts/dto/update-toast-selected-subjects';

@Controller('toasts')
export class ToastsController {
  private readonly logger = new Logger(ToastsController.name);

  private readonly toastEntityEvents: Observable<Toast>;

  constructor(
    private readonly toastsService: ToastsService,
    private readonly subjectsService: SubjectsService,
    private readonly firestoreService: VotingSessionService,
    private readonly eventEmitter: EventEmitter2
  ) {
    this.toastEntityEvents = merge(
      fromEvent(this.eventEmitter, ToastEntityEvents.CREATED),
      fromEvent(this.eventEmitter, ToastEntityEvents.UPDATED)
    ).pipe(flatMap(() => this.toastsService.findCurrentToast()));
  }

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
    const toastStatus = getTOASTStatusUtils(currentToast.status);

    this.logger.debug(
      `TOAST status change: ${currentToast.status} -> ${input.status}`
    );

    if (!toastStatus.isNextAllowedStatus(input.status)) {
      throw new BadRequestException(
        `Incorrect TOAST status. Status should either be ${toastStatus.getNextAllowedStatus()} or ${
          ToastStatus.CANCELLED
        }`
      );
    }

    if (input.status !== currentToast.status) {
      const toastIsAboutToOpenItsVotes =
        input.status === ToastStatus.OPEN_FOR_VOTE;

      const toastIsAboutToCloseItsVotes =
        input.status === ToastStatus.VOTE_CLOSED;

      const toastTriesToGetReadyWithTooManySelectedSubjects =
        input.status === ToastStatus.WAITING_FOR_TOAST &&
        currentToast.selectedSubjects.length >
          currentToast.maxSelectableSubjects;

      const toastIsAboutToBeCancelledWhileOpenedForVotes =
        currentToast.status === ToastStatus.OPEN_FOR_VOTE &&
        input.status === ToastStatus.CANCELLED;

      switch (true) {
        case toastIsAboutToOpenItsVotes:
          await this.openVotes(currentToast);
          break;

        case toastIsAboutToCloseItsVotes:
          await this.closeVotes(currentToast);
          break;

        case toastIsAboutToBeCancelledWhileOpenedForVotes:
          await this.cancelVotes(currentToast);
          break;

        case toastTriesToGetReadyWithTooManySelectedSubjects:
          throw new ForbiddenException(
            `You can't change the TOAST status to ${ToastStatus.WAITING_FOR_TOAST} because it has more selected subjects than the maximum allowed. (${currentToast.selectedSubjects.length} selected subjects for a max of ${currentToast.maxSelectableSubjects})`
          );
      }
    } else {
      this.logger.debug(
        `The HTTP request changed the current TOAST status to ${input.status}, but current TOAST status is already set to ${currentToast.status}.`
      );
    }

    return this.toastsService.updateCurrentToastStatus(currentToast, input);
  }

  /**
   * Endpoint used only for the case where there are more subjects
   * with the same amount of votes than the maximum allowed per TOAST.
   * @param input
   */
  @Put('current/selected-subjects')
  async updateToastSelectedSubjects(
    @Body() input: UpdateToastSelectedSubjectsDto
  ) {
    const currentToast = await this.getCurrentToast();

    if (currentToast.status !== ToastStatus.VOTE_CLOSED) {
      throw new ForbiddenException(
        `Selected subjects can be modified only when TOAST has status ${ToastStatus.VOTE_CLOSED}`
      );
    } else if (
      currentToast.selectedSubjects.length < currentToast.maxSelectableSubjects
    ) {
      throw new ForbiddenException(
        `Selected subjects can be modified only when TOAST as more selected subjects than allowed. ${currentToast.maxSelectableSubjects}`
      );
    } else {
      return this.toastsService.setSelectedSubjects(
        currentToast,
        input.selectedSubjectsIds
      );
    }
  }

  @Sse('current/synchronize')
  sendCurrentToast(): Observable<MessageEvent> {
    const currentToast = from(this.toastsService.findCurrentToast());

    return concat(currentToast, this.toastEntityEvents).pipe(
      map((data) => ({
        data: data || `${null}`,
      })),
      catchError(() => of({ data: `${null}` }))
    );
  }

  private async openVotes(currentToast: Toast) {
    this.logger.log('Opening votes for TOAST: ' + currentToast.id);

    /**
     * Get all available subjects.
     */
    const availableSubjects = await this.subjectsService.findAllByStatus(
      SubjectStatus.AVAILABLE
    );

    this.logger.log(
      `Found ${availableSubjects.length} available subject(s) for TOAST: ${currentToast.id}`
    );

    return this.firestoreService.create(currentToast.id, availableSubjects);
  }

  private async closeVotes(currentToast: Toast) {
    this.logger.log('Closing voting session for TOAST: ' + currentToast.id);

    /**
     * Prevent people to vote. Sorry people !
     */
    await this.firestoreService.peopleCanVote(currentToast.id, false);

    /**
     * Get Firebase vote results.
     */
    const results = (await this.firestoreService.getResults(
      currentToast.id
    )) as FirebaseVotingSessionDocument;

    if (results) {
      const allTotalVotes = getAllTotalVotesFromAllSubjects(results.votes);
      const allUniqueTotalVotes = allTotalVotes.filter(unique);
      const sortedTotalVotes = allUniqueTotalVotes.sort();
      const totalVotesSubjectsMustHave = sortedTotalVotes.splice(
        0,
        currentToast.maxSelectableSubjects
      );

      const selectedSubjectIds = getSelectedSubjectsIds(
        results.votes,
        totalVotesSubjectsMustHave
      );

      await this.toastsService.setSelectedSubjects(
        currentToast,
        selectedSubjectIds
      );

      await this.toastsService.setVotesResults(currentToast, results.votes);
    } else {
      this.logger.error(
        "Results of the voting session couldn't be retrieved from Firebase. The `.get()` request from the document returned " +
          results
      );
    }
  }

  private async cancelVotes(currentToast: Toast) {
    this.logger.log('Cancelling voting session of TOAST: ' + currentToast.id);

    /**
     * Stops the votes. Sorry people !
     */
    await this.firestoreService.peopleCanVote(currentToast.id, false);
  }
}
