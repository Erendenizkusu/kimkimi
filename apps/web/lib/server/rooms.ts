import {
  AnswerPhase,
  PlayerSeat,
  Prisma,
  QuestionPhase,
  QuestionStatus,
  RoomStatus,
} from '@prisma/client';
import { randomBytes, randomUUID } from 'crypto';
import { z } from 'zod';

import { parseGameOrderJson } from './game-order-json';
import { pickBalancedGameQuestionIds } from './game-pool-selection';
import { badRequest, conflict, forbidden, notFound, unauthorized } from './http';
import { prisma } from './prisma';
import { evaluateRoom } from './scoring';

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

export const createRoomSchema = z.object({
  categoryId: z.string().uuid(),
  hostDisplayName: z.string().min(1).max(64),
});

export const joinRoomSchema = z.object({
  shortCode: z
    .string()
    .transform((v) => String(v ?? '').toUpperCase())
    .pipe(z.string().min(4).max(8).regex(/^[A-Z2-9]+$/)),
  guestDisplayName: z.string().min(1).max(64),
});

export const profileAnswersSchema = z.object({
  answers: z
    .array(z.object({ questionId: z.string(), value: z.unknown() }))
    .min(1),
});

export const gameAnswerSchema = z.object({
  questionId: z.string().uuid(),
  value: z.unknown(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type JoinRoomInput = z.infer<typeof joinRoomSchema>;
export type ProfileAnswersInput = z.infer<typeof profileAnswersSchema>;
export type GameAnswerInput = z.infer<typeof gameAnswerSchema>;

function assertNotExpired(expiresAt: Date) {
  if (expiresAt < new Date()) throw forbidden('Room expired');
}

async function uniqueShortCode(tx: Prisma.TransactionClient): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const code = randomShortCode(6);
    const exists = await tx.room.findUnique({ where: { shortCode: code } });
    if (!exists) return code;
  }
  throw conflict('Could not allocate room code');
}

export async function createRoom(dto: CreateRoomInput) {
  const category = await prisma.category.findFirst({
    where: { id: dto.categoryId, active: true },
  });
  if (!category) throw notFound('Category not found');

  const profileQs = await prisma.question.findMany({
    where: {
      categoryId: dto.categoryId,
      phase: QuestionPhase.profile,
      status: QuestionStatus.published,
    },
    orderBy: { orderIndex: 'asc' },
  });
  const allGameQs = await prisma.question.findMany({
    where: {
      categoryId: dto.categoryId,
      phase: QuestionPhase.game,
      status: QuestionStatus.published,
      mapsToQuestionId: { not: null },
    },
    orderBy: { orderIndex: 'asc' },
  });

  if (profileQs.length === 0) throw badRequest('Category has no published profile questions');
  if (allGameQs.length === 0) throw badRequest('Category has no published game questions');

  const profileIds = new Set(profileQs.map((q) => q.id));
  for (const g of allGameQs) {
    if (!g.mapsToQuestionId || !profileIds.has(g.mapsToQuestionId)) {
      throw badRequest(`Game question ${g.id} maps outside category profile set`);
    }
  }

  const categoryRow = await prisma.category.findFirst({
    where: { id: dto.categoryId },
    select: { lastGameQuestionIds: true },
  });
  const lastGameIds = (categoryRow?.lastGameQuestionIds as string[] | null | undefined) ?? null;

  const poolRows = allGameQs.map((g) => ({ id: g.id, type: g.type }));
  const questionOrder = pickBalancedGameQuestionIds(poolRows, lastGameIds);
  if (questionOrder.length === 0) {
    throw badRequest('Could not select game questions for this room');
  }

  const secretId = randomUUID();
  const hostToken = randomPlayerToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const room = await prisma.$transaction(async (tx) => {
    const shortCode = await uniqueShortCode(tx);
    await tx.category.update({
      where: { id: dto.categoryId },
      data: { lastGameQuestionIds: questionOrder },
    });
    return tx.room.create({
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
  });

  return {
    roomId: room.id,
    shortCode: room.shortCode,
    secretId: room.secretId,
    hostPlayerToken: hostToken,
    expiresAt: room.expiresAt,
  };
}

export async function joinRoom(dto: JoinRoomInput) {
  const code = dto.shortCode.toUpperCase();
  const room = await prisma.room.findUnique({
    where: { shortCode: code },
    include: { roomPlayers: true },
  });
  if (!room) throw notFound('Room not found');
  assertNotExpired(room.expiresAt);

  if (room.status !== RoomStatus.waiting) throw conflict('Room is not accepting joins');
  if (room.roomPlayers.some((p) => p.seat === PlayerSeat.guest)) throw conflict('Room is full');

  const guestToken = randomPlayerToken();
  const updated = await prisma.$transaction(async (tx) => {
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

  return {
    roomId: updated.id,
    secretId: updated.secretId,
    guestPlayerToken: guestToken,
    status: updated.status,
  };
}

/**
 * NestJS'teki PlayerTokenGuard'ın karşılığı — token'ı odaya bağlar ve
 * süresi dolmuş odaları reddeder.
 */
export async function resolvePlayer(secretId: string, playerToken: string | null) {
  if (!playerToken) throw unauthorized('Missing bearer token');
  const player = await prisma.roomPlayer.findFirst({
    where: { playerToken, room: { secretId } },
    include: { room: true },
  });
  if (!player) throw unauthorized('Invalid token');
  if (player.room.expiresAt < new Date()) throw unauthorized('Room expired');
  return player;
}

export async function getPublicRoomState(secretId: string) {
  const room = await prisma.room.findUnique({
    where: { secretId },
    include: {
      roomPlayers: { orderBy: { seat: 'asc' } },
      category: { select: { id: true, slug: true, title: true } },
    },
  });
  if (!room) throw notFound('Room not found');
  assertNotExpired(room.expiresAt);

  const order = parseGameOrderJson(room.questionOrderJson);
  const gameMeta = await prisma.question.findMany({
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
      const c = await prisma.answer.count({
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
    room.status === RoomStatus.playing &&
    order.length > 0 &&
    room.currentQuestionIndex < order.length
      ? order[room.currentQuestionIndex]
      : null;

  return {
    secretId: room.secretId,
    shortCode: room.shortCode,
    status: room.status,
    category: room.category,
    players: room.roomPlayers.map((p) => ({ seat: p.seat, displayName: p.displayName })),
    profileProgress: counts,
    currentQuestionIndex: room.currentQuestionIndex,
    currentQuestionId,
    totalGameQuestions: order.length,
    expiresAt: room.expiresAt,
  };
}

export async function submitProfileAnswers(
  secretId: string,
  playerToken: string | null,
  dto: ProfileAnswersInput,
) {
  const player = await resolvePlayer(secretId, playerToken);
  const room = player.room;
  if (room.status !== RoomStatus.profile) throw badRequest('Room is not in profile phase');

  const order = parseGameOrderJson(room.questionOrderJson);
  const gameMeta = await prisma.question.findMany({
    where: { id: { in: order } },
    select: { id: true, mapsToQuestionId: true },
  });
  const mapToProfile = new Map(gameMeta.map((g) => [g.id, g.mapsToQuestionId]));
  const allowedProfileIds = new Set(
    order.map((gid) => mapToProfile.get(gid)).filter((id): id is string => Boolean(id)),
  );
  for (const a of dto.answers) {
    if (!allowedProfileIds.has(a.questionId)) {
      throw badRequest(`Invalid profile question: ${a.questionId}`);
    }
  }

  await prisma.$transaction(
    dto.answers.map((a) =>
      prisma.answer.upsert({
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

  const refreshed = await prisma.room.findUnique({
    where: { id: room.id },
    include: { roomPlayers: true },
  });
  if (!refreshed) return { ok: true };

  const totalProfile = allowedProfileIds.size;
  const profileIdList = Array.from(allowedProfileIds);
  const doneForEveryone = await Promise.all(
    refreshed.roomPlayers.map(async (p) => {
      const c = await prisma.answer.count({
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
    await prisma.room.update({
      where: { id: room.id },
      data: { status: RoomStatus.playing, currentQuestionIndex: 0 },
    });
  }

  return { ok: true };
}

export async function submitGameAnswer(
  secretId: string,
  playerToken: string | null,
  dto: GameAnswerInput,
) {
  const player = await resolvePlayer(secretId, playerToken);
  const room = await prisma.room.findUnique({ where: { id: player.roomId } });
  if (!room) throw notFound('Room not found');
  if (room.status !== RoomStatus.playing) throw badRequest('Room is not in playing phase');

  const order = parseGameOrderJson(room.questionOrderJson);
  if (order.length === 0) throw badRequest('No game questions');

  const expectedId = order[room.currentQuestionIndex];
  if (dto.questionId !== expectedId) throw badRequest('Question does not match current turn');

  let becameFinished = false;
  await prisma.$transaction(async (tx) => {
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
    const summary = await evaluateRoom(room.id);
    await prisma.gameResult.upsert({
      where: { roomId: room.id },
      create: { roomId: room.id, summaryJson: summary as unknown as Prisma.InputJsonValue },
      update: { summaryJson: summary as unknown as Prisma.InputJsonValue },
    });
  }

  return { ok: true };
}

export async function getResults(secretId: string, playerToken: string | null) {
  await resolvePlayer(secretId, playerToken);
  const room = await prisma.room.findUnique({
    where: { secretId },
    include: { gameResults: true },
  });
  if (!room) throw notFound('Room not found');
  if (room.status !== RoomStatus.finished) throw badRequest('Game not finished');
  if (!room.gameResults) throw notFound('Results not computed');
  return room.gameResults.summaryJson;
}
