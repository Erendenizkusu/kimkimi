import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlayerTokenGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = auth.slice('Bearer '.length).trim();
    const secretId = req.params.secretId as string;
    if (!secretId) throw new UnauthorizedException('Missing room');

    const player = await this.prisma.roomPlayer.findFirst({
      where: { playerToken: token, room: { secretId } },
      include: { room: true },
    });
    if (!player) throw new UnauthorizedException('Invalid token');

    if (player.room.expiresAt < new Date()) {
      throw new UnauthorizedException('Room expired');
    }

    req.roomPlayer = player;
    return true;
  }
}
