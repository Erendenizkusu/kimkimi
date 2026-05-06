import { QuestionType } from '@prisma/client';

export const GAME_ROUND_QUESTION_COUNT = 10;

export type GamePoolRow = { id: string; type: QuestionType };

const MC_MIN = 3;
const MC_MAX = 5;
const MC_TARGET = 4;

function isMc(t: QuestionType): boolean {
  return t === QuestionType.single_choice || t === QuestionType.multi_choice;
}

function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Havuzdan tam 10 soru: çoktan seçmeli ile klavye/tarih/sayı dengesi.
 * `lastGameIds`: bir önceki odada seçilen id’ler — mümkünse bunları dışarıda tutar;
 * yetersiz kalırsa tüm havuza döner.
 */
export function pickBalancedGameQuestionIds(
  pool: GamePoolRow[],
  lastGameIds: string[] | null | undefined,
): string[] {
  const n = GAME_ROUND_QUESTION_COUNT;
  if (pool.length === 0) return [];
  if (pool.length <= n) {
    return shuffle(pool).map((p) => p.id);
  }

  const lastSet = new Set((lastGameIds ?? []).filter(Boolean));
  const preferred = pool.filter((p) => !lastSet.has(p.id));
  const primary = preferred.length >= n ? preferred : [...pool];

  const tryPick = (source: GamePoolRow[]): string[] | null => {
    const mc = source.filter((p) => isMc(p.type));
    const kb = source.filter((p) => !isMc(p.type));

    let wantMc = Math.min(MC_MAX, Math.max(MC_MIN, Math.min(mc.length, MC_TARGET)));
    if (mc.length < MC_MIN) wantMc = mc.length;

    let kbNeed = n - wantMc;
    if (kb.length < kbNeed) {
      wantMc = Math.min(mc.length, Math.max(0, n - kb.length));
      kbNeed = n - wantMc;
    }

    if (mc.length < wantMc || kb.length < kbNeed) return null;

    const pickMc = shuffle(mc).slice(0, wantMc);
    const pickKb = shuffle(kb).slice(0, kbNeed);
    if (pickMc.length + pickKb.length !== n) return null;
    return shuffle([...pickMc, ...pickKb]).map((p) => p.id);
  };

  let ids = tryPick(primary);
  if (!ids) ids = tryPick(pool);
  if (!ids) {
    return shuffle(pool)
      .slice(0, n)
      .map((p) => p.id);
  }
  return ids;
}
