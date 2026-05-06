import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RoomStateNotifier {
  private server: Server | null = null;

  attachServer(server: Server) {
    this.server = server;
  }

  emitRoomState(secretId: string, payload: unknown) {
    this.server?.to(secretId).emit('room_state', payload);
  }

  emitStateSync(socketId: string, payload: unknown) {
    this.server?.to(socketId).emit('state_sync', payload);
  }
}
