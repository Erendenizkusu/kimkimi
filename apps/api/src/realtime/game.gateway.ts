import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { RoomStateNotifier } from '../rooms/room-state-notifier.service';
import { RoomsService } from '../rooms/rooms.service';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class GameGateway implements OnGatewayInit {
  private readonly logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: RoomStateNotifier,
    private readonly roomsService: RoomsService,
  ) {}

  afterInit() {
    this.notifier.attachServer(this.server);
    this.logger.log('GameGateway initialized');
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() body: { secretId: string; playerToken: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!body?.secretId || !body?.playerToken) {
      client.emit('error', { message: 'secretId and playerToken required' });
      return;
    }
    const player = await this.prisma.roomPlayer.findFirst({
      where: { playerToken: body.playerToken, room: { secretId: body.secretId } },
      include: { room: true },
    });
    if (!player) {
      client.emit('error', { message: 'Invalid token or room' });
      return;
    }
    await client.join(body.secretId);
    const state = await this.roomsService.getPublicRoomState(body.secretId);
    client.emit('state_sync', state);
    this.notifier.emitRoomState(body.secretId, state);
  }
}
