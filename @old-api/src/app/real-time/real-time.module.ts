import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { FirebaseModule } from 'api/firebase/firebase.module';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { VotingSessionGateway } from './gateways/voting-session.gateway';

@Module({
  imports: [FirebaseModule],
  providers: [NotificationsGateway, VotingSessionGateway],
})
export class RealTimeModule {}
