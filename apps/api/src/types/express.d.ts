import { PlayerSeat, Room, RoomPlayer } from '@prisma/client';

export type RoomPlayerRequestContext = RoomPlayer & { room: Room };

declare global {
  namespace Express {
    interface Request {
      roomPlayer?: RoomPlayerRequestContext;
    }
  }
}
