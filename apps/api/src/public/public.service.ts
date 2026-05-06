import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionPhase, QuestionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { parseGameOrderJson } from '../rooms/game-order-json';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Yalnızca oda açılabilen kategoriler (yayınlanmış profil + eşlemeli oyun sorusu).
   * Boş kategoriler listede görünmez; mobil/web yanlışlıkla 400 almaz.
   */
  async categories() {
    const rows = await this.prisma.category.findMany({
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
        return gameQs.every(
          (g) => g.mapsToQuestionId != null && profileIds.has(g.mapsToQuestionId),
        );
      })
      .map(({ questions: _q, ...rest }) => rest);
  }

  /**
   * @param secretId Oda gizli kimliği — verilirse yalnızca bu odada seçilen profil/oyun soruları döner (sıra korunur).
   */
  async questions(slug: string, phase?: QuestionPhase, secretId?: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, active: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    let idOrder: string[] | null = null;

    if (secretId && phase) {
      const room = await this.prisma.room.findUnique({
        where: { secretId },
        select: {
          questionOrderJson: true,
          category: { select: { slug: true } },
        },
      });
      if (room && room.category.slug === slug) {
        const order = parseGameOrderJson(room.questionOrderJson);
        if (phase === QuestionPhase.game) {
          idOrder = order;
        } else {
          const games = await this.prisma.question.findMany({
            where: { id: { in: order } },
            select: { id: true, mapsToQuestionId: true },
          });
          const m = new Map(games.map((g) => [g.id, g.mapsToQuestionId]));
          idOrder = order.map((gid) => m.get(gid)).filter((x): x is string => Boolean(x));
        }
      }
    }

    const rows = await this.prisma.question.findMany({
      where: {
        categoryId: category.id,
        status: QuestionStatus.published,
        ...(phase ? { phase } : {}),
        ...(idOrder && idOrder.length > 0 ? { id: { in: idOrder } } : {}),
      },
      ...(idOrder && idOrder.length > 0 ? {} : { orderBy: { orderIndex: 'asc' } }),
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
}
