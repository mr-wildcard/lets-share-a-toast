import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';

import {
  ClientSideVoteEvent,
  WebSocketNamespaces,
  RealTimeVote,
} from '@letsshareatoast/shared';

import { VotingSessionService } from 'api/firebase/voting-session.service';

@WebSocketGateway({
  transport: 'websocket',
  namespace: WebSocketNamespaces.VOTING_SESSION,
})
export class VotingSessionGateway {
  constructor(
    private readonly firestoreVotingSessionService: VotingSessionService
  ) {}

  @SubscribeMessage(ClientSideVoteEvent.TOGGLED_VOTE)
  onVoteToggled(
    @MessageBody() { currentToastId, userId, subjectId }: RealTimeVote
  ) {
    return this.firestoreVotingSessionService.addVoteToSubject({
      currentToastId,
      userId,
      subjectId,
    });
  }
}
