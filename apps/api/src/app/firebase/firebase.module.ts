import { Module } from '@nestjs/common';

import { VotingSessionService } from './voting-session.service';

@Module({
  exports: [VotingSessionService],
  providers: [VotingSessionService],
})
export class FirebaseModule {}
