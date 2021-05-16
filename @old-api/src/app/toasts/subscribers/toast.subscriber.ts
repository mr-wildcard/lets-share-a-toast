import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { ToastStatus } from '@letsshareatoast/shared';

import { Toast } from '../entities/toast.entity';
import { ToastEntityEvents } from '../enums/ToastEntityEvents';

/**
 * How to inject a NestJS service inside a TypeORM subscriber.
 * https://github.com/nestjs/typeorm/pull/27#issuecomment-431296683
 */
@Injectable()
export class ToastSubscriber implements EntitySubscriberInterface<Toast> {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private eventEmitter: EventEmitter2
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Toast;
  }

  afterInsert() {
    this.eventEmitter.emit(ToastEntityEvents.CREATED);
  }

  afterUpdate() {
    this.eventEmitter.emit(ToastEntityEvents.UPDATED);
  }
}
