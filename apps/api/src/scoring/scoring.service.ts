import { Injectable } from '@nestjs/common';
import { AnswerPhase, QuestionType, RoomPlayer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeText } from '../common/normalize';
import { parseGameOrderJson } from '../rooms/game-order-json';

/** choicesJson dizisinden şık değerlerini okur (string veya { value, label }). */
export function choiceValuesFromChoicesJson(raw: unknown): string[] {
  if (!raw || !Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string') out.push(item);
    else if (item && typeof item === 'object') {
      const o = item as Record<string, unknown>;
      const v = o.value ?? o.label ?? o.id;
      if (v != null) out.push(String(v));
    }
  }
  return out;
}

/** Şıklarda hem Ben hem O varsa (çift perspektifli sorular), bu ikili için özel eşleştirme uygulanır. */
export function questionOffersBenAndO(choicesJson: unknown): boolean {
  const vals = choiceValuesFromChoicesJson(choicesJson);
  return vals.includes('Ben') && vals.includes('O');
}

/** Partner "Ben" dediğinde tahmin "O" (veya tersi) aynı kişiyi işaret eder. */
export function singleChoiceBenOBiPerspectiveMatch(expected: string, answered: string): boolean {
  if (expected === answered) return true;
  return (
    (expected === 'Ben' && answered === 'O') ||
    (expected === 'O' && answered === 'Ben')
  );
}

export type ResultDetail = {
  questionId: string;
  prompt: string;
  correct: boolean;
  expected: unknown;
  answered: unknown;
};

@Injectable()
export class ScoringService {
  constructor(private readonly prisma: PrismaService) {}

  compareValues(
    type: QuestionType,
    expected: unknown,
    answered: unknown,
    /** Yalnızca single_choice: Ben/O perspektif eşlemesi için sorunun choicesJson’ı */
    choicesJson?: unknown,
  ): boolean {
    if (answered === null || answered === undefined) return false;
    switch (type) {
      case QuestionType.text:
      case QuestionType.date:
        return normalizeText(String(expected ?? '')) === normalizeText(String(answered ?? ''));
      case QuestionType.number:
        return Number(expected) === Number(answered);
      case QuestionType.single_choice: {
        const e = String(expected ?? '').trim();
        const a = String(answered ?? '').trim();
        if (e === a) return true;
        if (
          choicesJson !== undefined &&
          questionOffersBenAndO(choicesJson) &&
          (e === 'Ben' || e === 'O') &&
          (a === 'Ben' || a === 'O')
        ) {
          return singleChoiceBenOBiPerspectiveMatch(e, a);
        }
        return false;
      }
      case QuestionType.multi_choice: {
        const a = Array.isArray(expected) ? [...expected].map(String).sort() : [];
        const b = Array.isArray(answered) ? [...answered].map(String).sort() : [];
        return JSON.stringify(a) === JSON.stringify(b);
      }
      default:
        return false;
    }
  }

  async evaluateRoom(roomId: string): Promise<{
    perPlayer: { seat: string; score: number; max: number; details: ResultDetail[] }[];
    winnerSeat: string | null;
  }> {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        roomPlayers: true,
        category: true,
      },
    });
    if (!room) throw new Error('Room not found');

    const order = parseGameOrderJson(room.questionOrderJson);
    const gameQuestions = await this.prisma.question.findMany({
      where: { id: { in: order } },
    });
    const byId = new Map(gameQuestions.map((q) => [q.id, q]));

    const host = room.roomPlayers.find((p) => p.seat === 'host');
    const guest = room.roomPlayers.find((p) => p.seat === 'guest');
    if (!host || !guest) throw new Error('Players missing');

    const profileAnswers = await this.prisma.answer.findMany({
      where: {
        phase: AnswerPhase.profile,
        roomPlayerId: { in: [host.id, guest.id] },
      },
    });

    const profileByPlayerQuestion = new Map<string, unknown>();
    for (const a of profileAnswers) {
      profileByPlayerQuestion.set(`${a.roomPlayerId}:${a.questionId}`, a.valueJson);
    }

    const gameAnswers = await this.prisma.answer.findMany({
      where: {
        phase: AnswerPhase.game,
        roomPlayerId: { in: [host.id, guest.id] },
      },
    });
    const gameByPlayerQuestion = new Map<string, unknown>();
    for (const a of gameAnswers) {
      gameByPlayerQuestion.set(`${a.roomPlayerId}:${a.questionId}`, a.valueJson);
    }

    const scoreFor = (player: RoomPlayer, partner: RoomPlayer): ResultDetail[] => {
      const details: ResultDetail[] = [];
      for (const qid of order) {
        const q = byId.get(qid);
        if (!q || !q.mapsToQuestionId) continue;
        const expected = profileByPlayerQuestion.get(`${partner.id}:${q.mapsToQuestionId}`);
        const answered = gameByPlayerQuestion.get(`${player.id}:${qid}`);
        const correct = this.compareValues(q.type, expected, answered, q.choicesJson);
        details.push({
          questionId: qid,
          prompt: q.prompt,
          correct,
          expected,
          answered,
        });
      }
      return details;
    };

    const hostDetails = scoreFor(host, guest);
    const guestDetails = scoreFor(guest, host);
    const hostScore = hostDetails.filter((d) => d.correct).length;
    const guestScore = guestDetails.filter((d) => d.correct).length;
    const max = order.length;

    let winnerSeat: string | null = null;
    if (hostScore > guestScore) winnerSeat = 'host';
    else if (guestScore > hostScore) winnerSeat = 'guest';

    return {
      perPlayer: [
        { seat: 'host', score: hostScore, max, details: hostDetails },
        { seat: 'guest', score: guestScore, max, details: guestDetails },
      ],
      winnerSeat,
    };
  }
}
