import { QuestionPhase, QuestionStatus } from '@prisma/client';

import { parseGameOrderJson } from './game-order-json';
import { notFound } from './http';
import { prisma } from './prisma';

/**
 * Yalnızca oda açılabilen kategoriler (yayınlanmış profil + eşlemeli oyun sorusu).
 * Boş kategoriler listede görünmez; mobil/web yanlışlıkla 400 almaz.
 */
export async function listCategories() {
  const rows = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      sortOrder: true,
      questions: {
        where: { status: QuestionStatus.published },
        select: { id: true, phase: true, mapsToQuestionId: true },
      },
    },
  });

  return rows
    .filter((c) => {
      const profileIds = new Set(
        c.questions.filter((q) => q.phase === QuestionPhase.profile).map((q) => q.id),
      );
      if (profileIds.size === 0) return false;
      const gameQs = c.questions.filter(
        (q) => q.phase === QuestionPhase.game && q.mapsToQuestionId != null,
      );
      if (gameQs.length === 0) return false;
      return gameQs.every((g) => g.mapsToQuestionId != null && profileIds.has(g.mapsToQuestionId));
    })
    // `questions` yalnızca yukarıdaki filtre için çekildi; yanıtta yer almaz.
    .map((c) => ({ id: c.id, slug: c.slug, title: c.title, sortOrder: c.sortOrder }));
}

/**
 * @param secretId Oda gizli kimliği — verilirse yalnızca bu odada seçilen
 *   profil/oyun soruları döner (sıra korunur).
 */
export async function listQuestions(slug: string, phase?: QuestionPhase, secretId?: string) {
  const category = await prisma.category.findFirst({ where: { slug, active: true } });
  if (!category) throw notFound('Category not found');

  let idOrder: string[] | null = null;

  if (secretId && phase) {
    const room = await prisma.room.findUnique({
      where: { secretId },
      select: { questionOrderJson: true, category: { select: { slug: true } } },
    });
    if (room && room.category.slug === slug) {
      const order = parseGameOrderJson(room.questionOrderJson);
      if (phase === QuestionPhase.game) {
        idOrder = order;
      } else {
        const games = await prisma.question.findMany({
          where: { id: { in: order } },
          select: { id: true, mapsToQuestionId: true },
        });
        const m = new Map(games.map((g) => [g.id, g.mapsToQuestionId]));
        idOrder = order.map((gid) => m.get(gid)).filter((x): x is string => Boolean(x));
      }
    }
  }

  const rows = await prisma.question.findMany({
    where: {
      categoryId: category.id,
      status: QuestionStatus.published,
      ...(phase ? { phase } : {}),
      ...(idOrder && idOrder.length > 0 ? { id: { in: idOrder } } : {}),
    },
    ...(idOrder && idOrder.length > 0 ? {} : { orderBy: { orderIndex: 'asc' as const } }),
    select: {
      id: true,
      phase: true,
      type: true,
      prompt: true,
      choicesJson: true,
      orderIndex: true,
      mapsToQuestionId: true,
    },
  });

  if (idOrder && idOrder.length > 0) {
    const byId = new Map(rows.map((r) => [r.id, r]));
    return idOrder.map((id) => byId.get(id)).filter((r): r is (typeof rows)[number] => Boolean(r));
  }

  return rows;
}
