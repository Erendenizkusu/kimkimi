import { QuestionType } from '@prisma/client';

import type { TypedQuestionPair } from './sevgili-pool';

/**
 * Karşılaştırma sorularında oyun fazında kullanılan hitap. Her havuz kendi
 * mevcut üslubunu korur (bkz. ilgili `*-pool.ts` içindeki `game` metinleri).
 */
export type OpponentLabel =
  | 'Partnerin'
  | 'Arkadaşın'
  | 'Rakibin'
  | 'Diğer oyuncu';

export const DEFAULT_COMPARISON_CHOICES = ['Ben', 'O'];

/**
 * "Daha inatçı olan hanginiz?" gibi karşılaştırma sorularında sahiplik dönüşümü
 * ("Partnerin daha inatçı olan hanginiz?") sorunun kimin bakış açısından
 * sorulduğunu belirsiz bırakıyor. Bunun yerine profil sorusu oyun fazında
 * tırnak içinde aynen alıntılanır:
 *
 *   profil : "Daha inatçı olan hanginiz?"            → şıklar: Ben · O
 *   oyun   : Partnerin “Daha inatçı olan hanginiz?” sorusuna ne cevap vermiştir?
 *
 * Oyun fazındaki `Ben`, cevabı veren kişiyi; `O` tahmin edeni gösterir —
 * alıntı sayesinde bu net kalır.
 */
export function comparisonPair(
  opponent: OpponentLabel,
  profile: string,
  choices: string[] = DEFAULT_COMPARISON_CHOICES,
): TypedQuestionPair {
  return {
    profile,
    game: `${opponent} “${profile}” sorusuna ne cevap vermiştir?`,
    type: QuestionType.single_choice,
    choices,
  };
}
