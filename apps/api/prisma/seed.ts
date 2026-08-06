import { Prisma, PrismaClient, QuestionPhase, QuestionStatus, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CATEGORY_SEED_DEFS, type QuestionPair } from './seed-data';
import { CHOICE_FORMAT_UPGRADES } from './question-choice-upgrades';
import { COMPARISON_UPGRADES } from './question-comparison-upgrades';
import { OPEN_TEXT_PROMPTS } from './question-open-text-prompts';
import { LEGACY_SEVGILI_PROFILE_PROMPTS } from './sevgili-pool';

const prisma = new PrismaClient();

/** Eski Sevgili profil çiftlerini yayından kaldırır (yeni havuzla çakışmasın). */
async function draftLegacySevgiliProfilePairs(categoryId: string) {
  const legacyProfiles = await prisma.question.findMany({
    where: {
      categoryId,
      phase: QuestionPhase.profile,
      status: QuestionStatus.published,
      prompt: { in: LEGACY_SEVGILI_PROFILE_PROMPTS },
    },
    select: { id: true },
  });
  const ids = legacyProfiles.map((p) => p.id);
  if (ids.length === 0) return;
  await prisma.question.updateMany({
    where: { categoryId, phase: QuestionPhase.game, mapsToQuestionId: { in: ids } },
    data: { status: QuestionStatus.draft },
  });
  await prisma.question.updateMany({
    where: { id: { in: ids } },
    data: { status: QuestionStatus.draft },
  });
}

/**
 * Profil sorusu (yayında) yoksa çift ekler (profil + eşlemeli oyun).
 * Aynı seed tekrar çalışınca yinelenmez.
 */
async function ensureQuestionPairsForCategory(categoryId: string, pairs: QuestionPair[]) {
  let added = 0;
  for (const pair of pairs) {
    const exists = await prisma.question.findFirst({
      where: {
        categoryId,
        phase: QuestionPhase.profile,
        prompt: pair.profile,
        status: QuestionStatus.published,
      },
    });
    if (exists) continue;

    const maxProfile = await prisma.question.aggregate({
      where: { categoryId, phase: QuestionPhase.profile },
      _max: { orderIndex: true },
    });
    const maxGame = await prisma.question.aggregate({
      where: { categoryId, phase: QuestionPhase.game },
      _max: { orderIndex: true },
    });
    const nextProfileOrder = (maxProfile._max.orderIndex ?? 0) + 1;
    const nextGameOrder = (maxGame._max.orderIndex ?? 0) + 1;

    const qType = pair.type ?? QuestionType.text;
    const needsChoices = qType === QuestionType.single_choice || qType === QuestionType.multi_choice;
    const choicesJson =
      needsChoices && pair.choices && pair.choices.length > 0
        ? (pair.choices as Prisma.InputJsonValue)
        : undefined;

    const profileRow = await prisma.question.create({
      data: {
        categoryId,
        phase: QuestionPhase.profile,
        type: qType,
        prompt: pair.profile,
        orderIndex: nextProfileOrder,
        status: QuestionStatus.published,
        ...(choicesJson !== undefined ? { choicesJson } : {}),
      },
    });

    await prisma.question.create({
      data: {
        categoryId,
        phase: QuestionPhase.game,
        type: qType,
        prompt: pair.game,
        orderIndex: nextGameOrder,
        status: QuestionStatus.published,
        mapsToQuestionId: profileRow.id,
        ...(choicesJson !== undefined ? { choicesJson } : {}),
      },
    });
    added += 1;
  }
  return added;
}

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@kimkimi.local' },
    update: {},
    create: {
      email: 'admin@kimkimi.local',
      passwordHash,
      role: 'admin',
    },
  });

  for (const def of CATEGORY_SEED_DEFS) {
    const cat = await prisma.category.upsert({
      where: { slug: def.slug },
      update: { title: def.title, active: true, sortOrder: def.sortOrder },
      create: {
        slug: def.slug,
        title: def.title,
        sortOrder: def.sortOrder,
        active: true,
      },
    });
    if (def.slug === 'sevgili') {
      await draftLegacySevgiliProfilePairs(cat.id);
    }
    const n = await ensureQuestionPairsForCategory(cat.id, def.pairs);
    if (n > 0) {
      console.log(`Seed: ${def.slug} — ${n} yeni soru çifti eklendi`);
    } else {
      console.log(`Seed: ${def.slug} — güncel (yeni çift yok)`);
    }
  }

  let upgraded = 0;
  for (const u of CHOICE_FORMAT_UPGRADES) {
    const phase = u.phase === 'profile' ? QuestionPhase.profile : QuestionPhase.game;
    const r = await prisma.question.updateMany({
      where: { prompt: u.prompt, phase, type: QuestionType.text },
      data: {
        type: QuestionType.single_choice,
        choicesJson: u.choices,
      },
    });
    upgraded += r.count;
  }
  if (upgraded > 0) {
    console.log(`Seed: ${upgraded} soru çoktan seçmeli formata güncellendi`);
  }

  let openText = 0;
  for (const u of OPEN_TEXT_PROMPTS) {
    const phase = u.phase === 'profile' ? QuestionPhase.profile : QuestionPhase.game;
    const r = await prisma.question.updateMany({
      where: { prompt: u.prompt, phase },
      data: {
        type: QuestionType.text,
        choicesJson: Prisma.DbNull,
      },
    });
    openText += r.count;
  }
  if (openText > 0) {
    console.log(`Seed: ${openText} soru serbest metin (şıksız) olarak sabitlendi`);
  }

  // Kural B: yayındaki karşılaştırma sorularının oyun metnini alıntılı biçime çevir.
  // (ensureQuestionPairsForCategory profil prompt'una bakıp atladığı için elle gerekiyor.)
  let comparison = 0;
  for (const u of COMPARISON_UPGRADES) {
    const r = await prisma.question.updateMany({
      where: { prompt: u.oldGamePrompt, phase: QuestionPhase.game },
      data: {
        prompt: u.newGamePrompt,
        type: QuestionType.single_choice,
        ...(u.choices ? { choicesJson: u.choices } : {}),
      },
    });
    comparison += r.count;
    if (u.choices) {
      await prisma.question.updateMany({
        where: { prompt: u.profilePrompt, phase: QuestionPhase.profile },
        data: { type: QuestionType.single_choice, choicesJson: u.choices },
      });
    }
  }
  if (comparison > 0) {
    console.log(`Seed: ${comparison} karşılaştırma sorusu alıntılı oyun metnine çevrildi`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
