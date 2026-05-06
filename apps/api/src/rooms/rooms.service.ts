import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AnswerPhase,
  PlayerSeat,
  Prisma,
  QuestionPhase,
  QuestionStatus,
  RoomStatus,
} from '@prisma/client';
import { randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { RoomStateNotifier } from './room-state-notifier.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { ProfileAnswersDto } from './dto/profile-answers.dto';
import { GameAnswerDto } from './dto/game-answer.dto';
import { parseGameOrderJson } from './game-order-json';
import { pickBalancedGameQuestionIds } from './game-pool-selection';

const SHORT_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function randomPlayerToken(): string {
  return randomBytes(32).toString('base64url');
}

function randomShortCode(length = 6): string {
  let s = '';
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    s += SHORT_CODE_ALPHABET[bytes[i] % SHORT_CODE_ALPHABET.length];
  }
  return s;
}

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
    private readonly notifier: RoomStateNotifier,
  ) {}

  private assertNotExpired(expiresAt: Date) {
    if (expiresAt < new Date()) {
      throw new ForbiddenException('Room expired');
    }
  }

  private async uniqueShortCode(tx: Prisma.TransactionClient): Promise<string> {
    for (let i = 0; i < 20; i++) {
      const code = randomShortCode(6);
      const exists = await tx.room.findUnique({ where: { shortCode: code } });
      if (!exists) return code;
    }
    throw new ConflictException('Could not allocate room code');
  }

  async createRoom(dto: CreateRoomDto) {
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, active: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    const profileQs = await this.prisma.question.findMany({
      where: {
        categoryId: dto.categoryId,
        phase: QuestionPhase.profile,
        status: QuestionStatus.published,
      },
      orderBy: { orderIndex: 'asc' },
    });
    const allGameQs = await this.prisma.question.findMany({
      where: {
        categoryId: dto.categoryId,
        phase: QuestionPhase.game,
        status: QuestionStatus.published,
        mapsToQuestionId: { not: null },
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (profileQs.length === 0) {
      throw new BadRequestException('Category has no published profile questions');
    }
    if (allGameQs.length === 0) {
      throw new BadRequestException('Category has no published game questions');
    }

    const profileIds = new Set(profileQs.map((q) => q.id));
    for (const g of allGameQs) {
      if (!g.mapsToQuestionId || !profileIds.has(g.mapsToQuestionId)) {
        throw new BadRequestException(`Game question ${g.id} maps outside category profile set`);
      }
    }

    const categoryRow = await this.prisma.category.findFirst({
      where: { id: dto.categoryId },
      select: { lastGameQuestionIds: true },
    });
    const lastGameIds = (categoryRow?.lastGameQuestionIds as string[] | null | undefined) ?? null;

    const poolRows = allGameQs.map((g) => ({ id: g.id, type: g.type }));
    const questionOrder = pickBalancedGameQuestionIds(poolRows, lastGameIds);
    if (questionOrder.length === 0) {
      throw new BadRequestException('Could not select game questions for this room');
    }
    const secretId = randomUUID();
    const hostToken = randomPlayerToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const room = await this.prisma.$transaction(async (tx) => {
      const shortCode = await this.uniqueShortCode(tx);
      await tx.category.update({
        where: { id: dto.categoryId },
        data: { lastGameQuestionIds: questionOrder },
      });
      const r = await tx.room.create({
        data: {
          shortCode,
          secretId,
          categoryId: dto.categoryId,
          status: RoomStatus.waiting,
          currentQuestionIndex: 0,
          questionOrderJson: questionOrder,
          expiresAt,
          roomPlayers: {
            create: {
              displayName: dto.hostDisplayName,
              seat: PlayerSeat.host,
              playerToken: hostToken,
            },
          },
        },
        include: { roomPlayers: true },
      });
      return r;
    });

    return {
      roomId: room.id,
      shortCode: room.shortCode,
      secretId: room.secretId,
      hostPlayerToken: hostToken,
      expiresAt: room.expiresAt,
    };
  }

  async joinRoom(dto: JoinRoomDto) {
    const code = dto.shortCode.toUpperCase();
    const room = await this.prisma.room.findUnique({
      where: { shortCode: code },
      include: { roomPlayers: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    this.assertNotExpired(room.expiresAt);

    if (room.status !== RoomStatus.waiting) {
      throw new ConflictException('Room is not accepting joins');
    }
    const guestExists = room.roomPlayers.some((p) => p.seat === PlayerSeat.guest);
    if (guestExists) throw new ConflictException('Room is full');

    const guestToken = randomPlayerToken();
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.roomPlayer.create({
        data: {
          roomId: room.id,
          displayName: dto.guestDisplayName,
          seat: PlayerSeat.guest,
          playerToken: guestToken,
        },
      });
      return tx.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.profile },
        include: { roomPlayers: true },
      });
    });

    const state = await this.getPublicRoomState(updated.secretId);
    this.notifier.emitRoomState(updated.secretId, state);

    return {
      roomId: updated.id,
      secretId: updated.secretId,
      guestPlayerToken: guestToken,
      status: updated.status,
    };
  }

  async resolvePlayer(secretId: string, playerToken: string) {
    const player = await this.prisma.roomPlayer.findFirst({
      where: { playerToken, room: { secretId } },
      include: { room: true },
    });
    if (!player) throw new ForbiddenException('Invalid player token');
    this.assertNotExpired(player.room.expiresAt);
    return player;
  }

  async getPublicRoomState(secretId: string) {
    const room = await this.prisma.room.findUnique({
      where: { secretId },
      include: {
        roomPlayers: { orderBy: { seat: 'asc' } },
        category: { select: { id: true, slug: true, title: true } },
      },
    });
    if (!room) throw new NotFoundException('Room not found');
    this.assertNotExpired(room.expiresAt);

    const order = parseGameOrderJson(room.questionOrderJson);
    const gameMeta = await this.prisma.question.findMany({
      where: { id: { in: order } },
      select: { id: true, mapsToQuestionId: true },
    });
    const mapToProfile = new Map(gameMeta.map((g) => [g.id, g.mapsToQuestionId]));
    const profileIdsInPlay = order
      .map((gid) => mapToProfile.get(gid))
      .filter((id): id is string => Boolean(id));
    const totalProfile = profileIdsInPlay.length;

    const counts = await Promise.all(
      room.roomPlayers.map(async (p) => {
        const c = await this.prisma.answer.count({
          where: {
            roomPlayerId: p.id,
            phase: AnswerPhase.profile,
            questionId: { in: profileIdsInPlay },
          },
        });
        return { seat: p.seat, answered: c, total: totalProfile, done: c >= totalProfile };
      }),
    );
    const currentQuestionId =
      room.status === RoomStatus.playing && order.length > 0 && room.currentQuestionIndex < order.length
        ? order[room.currentQuestionIndex]
        : null;

    return {
      secretId: room.secretId,
      shortCode: room.shortCode,
      status: room.status,
      category: room.category,
      players: room.roomPlayers.map((p) => ({
        seat: p.seat,
        displayName: p.displayName,
      })),
      profileProgress: counts,
      currentQuestionIndex: room.currentQuestionIndex,
      currentQuestionId,
      totalGameQuestions: order.length,
      expiresAt: room.expiresAt,
    };
  }

  private async broadcast(secretId: string) {
    const state = await this.getPublicRoomState(secretId);
    this.notifier.emitRoomState(secretId, state);
  }

  async submitProfileAnswers(secretId: string, playerToken: string, dto: ProfileAnswersDto) {
    const player = await this.resolvePlayer(secretId, playerToken);
    const room = player.room;
    if (room.status !== RoomStatus.profile) {
      throw new BadRequestException('Room is not in profile phase');
    }

    const order = parseGameOrderJson(room.questionOrderJson);
    const gameMeta = await this.prisma.question.findMany({
      where: { id: { in: order } },
      select: { id: true, mapsToQuestionId: true },
    });
    const mapToProfile = new Map(gameMeta.map((g) => [g.id, g.mapsToQuestionId]));
    const allowedProfileIds = new Set(
      order.map((gid) => mapToProfile.get(gid)).filter((id): id is string => Boolean(id)),
    );
    for (const a of dto.answers) {
      if (!allowedProfileIds.has(a.questionId)) {
        throw new BadRequestException(`Invalid profile question: ${a.questionId}`);
      }
    }

    await this.prisma.$transaction(
      dto.answers.map((a) =>
        this.prisma.answer.upsert({
          where: {
            roomPlayerId_questionId_phase: {
              roomPlayerId: player.id,
              questionId: a.questionId,
              phase: AnswerPhase.profile,
            },
          },
          create: {
            roomPlayerId: player.id,
            questionId: a.questionId,
            phase: AnswerPhase.profile,
            valueJson: a.value as Prisma.InputJsonValue,
          },
          update: { valueJson: a.value as Prisma.InputJsonValue },
        }),
      ),
    );

    const refreshed = await this.prisma.room.findUnique({
      where: { id: room.id },
      include: { roomPlayers: true },
    });
    if (!refreshed) return;

    const totalProfile = allowedProfileIds.size;
    const profileIdList = [...allowedProfileIds];
    const doneForEveryone = await Promise.all(
      refreshed.roomPlayers.map(async (p) => {
        const c = await this.prisma.answer.count({
          where: {
            roomPlayerId: p.id,
            phase: AnswerPhase.profile,
            questionId: { in: profileIdList },
          },
        });
        return c >= totalProfile;
      }),
    );

    if (doneForEveryone.every(Boolean)) {
      await this.prisma.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.playing, currentQuestionIndex: 0 },
      });
    }

    await this.broadcast(secretId);
    return { ok: true };
  }

  async submitGameAnswer(secretId: string, playerToken: string, dto: GameAnswerDto) {
    const player = await this.resolvePlayer(secretId, playerToken);
    const room = await this.prisma.room.findUnique({ where: { id: player.roomId } });
    if (!room) throw new NotFoundException('Room not found');
    if (room.status !== RoomStatus.playing) {
      throw new BadRequestException('Room is not in playing phase');
    }

    const order = parseGameOrderJson(room.questionOrderJson);
    if (order.length === 0) throw new BadRequestException('No game questions');

    const expectedId = order[room.currentQuestionIndex];
    if (dto.questionId !== expectedId) {
      throw new BadRequestException('Question does not match current turn');
    }

    let becameFinished = false;
    await this.prisma.$transaction(async (tx) => {
      await tx.answer.upsert({
        where: {
          roomPlayerId_questionId_phase: {
            roomPlayerId: player.id,
            questionId: dto.questionId,
            phase: AnswerPhase.game,
          },
        },
        create: {
          roomPlayerId: player.id,
          questionId: dto.questionId,
          phase: AnswerPhase.game,
          valueJson: dto.value as Prisma.InputJsonValue,
        },
        update: { valueJson: dto.value as Prisma.InputJsonValue },
      });

      const r = await tx.room.findUnique({
        where: { id: room.id },
        include: { roomPlayers: true },
      });
      if (!r) return;

      const answersForQuestion = await tx.answer.findMany({
        where: {
          questionId: dto.questionId,
          phase: AnswerPhase.game,
          roomPlayer: { roomId: room.id },
        },
      });

      if (answersForQuestion.length < 2) return;

      const nextIndex = r.currentQuestionIndex + 1;
      if (nextIndex >= order.length) {
        await tx.room.update({
          where: { id: room.id },
          data: { status: RoomStatus.finished, currentQuestionIndex: nextIndex },
        });
        becameFinished = true;
      } else {
        await tx.room.update({
          where: { id: room.id },
          data: { currentQuestionIndex: nextIndex },
        });
      }
    });

    if (becameFinished) {
      const summary = await this.scoring.evaluateRoom(room.id);
      await this.prisma.gameResult.upsert({
        where: { roomId: room.id },
        create: {
          roomId: room.id,
          summaryJson: summary as unknown as Prisma.InputJsonValue,
        },
        update: { summaryJson: summary as unknown as Prisma.InputJsonValue },
      });
    }

    await this.broadcast(secretId);
    return { ok: true };
  }

  async getResults(secretId: string, playerToken: string) {
    await this.resolvePlayer(secretId, playerToken);
    const room = await this.prisma.room.findUnique({
      where: { secretId },
      include: { gameResults: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    if (room.status !== RoomStatus.finished) {
      throw new BadRequestException('Game not finished');
    }
    if (!room.gameResults) {
      throw new NotFoundException('Results not computed');
    }
    return room.gameResults.summaryJson;
  }
}
