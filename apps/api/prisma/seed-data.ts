import type { QuestionType } from '@prisma/client';

import { AILE_TYPED_PAIRS } from './aile-pool';
import { ARKADAS_TYPED_PAIRS } from './arkadas-pool';
import { EGLENCE_TYPED_PAIRS } from './eglence-pool';
import { GYM_BUDDY_TYPED_PAIRS } from './gym-buddy-pool';
import { IS_ARKADASI_TYPED_PAIRS } from './is-arkadasi-pool';
import { SEVGILI_TYPED_PAIRS } from './sevgili-pool';

/**
 * Kategori + profil/oyun soru çiftleri.
 * Oyun sorusu (game), mapsToQuestionId ile ilgili profil sorusunun cevabını tahmin eder
 * (bkz. rooms.service / scoring).
 *
 * `type` / `choices` yoksa seed varsayılan olarak metin soru oluşturur.
 */
export type QuestionPair = {
  profile: string;
  game: string;
  type?: QuestionType;
  choices?: string[];
};

export type CategorySeedDef = {
  slug: string;
  title: string;
  sortOrder: number;
  pairs: QuestionPair[];
};

export const CATEGORY_SEED_DEFS: CategorySeedDef[] = [
  {
    slug: 'sevgili',
    title: 'Sevgili',
    sortOrder: 1,
    pairs: SEVGILI_TYPED_PAIRS,
  },
  {
    slug: 'arkadas',
    title: 'Arkadaş',
    sortOrder: 2,
    pairs: ARKADAS_TYPED_PAIRS,
  },
  {
    slug: 'eglence',
    title: 'Eğlence & Parti',
    sortOrder: 3,
    pairs: EGLENCE_TYPED_PAIRS,
  },
  {
    slug: 'aile',
    title: 'Aile',
    sortOrder: 4,
    pairs: AILE_TYPED_PAIRS,
  },
  {
    slug: 'is-arkadasi',
    title: 'İş arkadaşı',
    sortOrder: 5,
    pairs: IS_ARKADASI_TYPED_PAIRS,
  },
  {
    slug: 'gym-buddy',
    title: 'Gym Buddy',
    sortOrder: 6,
    pairs: GYM_BUDDY_TYPED_PAIRS,
  },
];
