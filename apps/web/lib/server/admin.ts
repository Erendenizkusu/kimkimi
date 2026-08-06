import { Prisma, QuestionPhase, QuestionStatus, QuestionType } from '@prisma/client';
import { z } from 'zod';

import { badRequest, notFound } from './http';
import { prisma } from './prisma';

/* ————————————————————————— kategoriler ————————————————————————— */

export const createCategorySchema = z.object({
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(128),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export function listCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getCategory(id: string) {
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) throw notFound('Category not found');
  return c;
}

export function createCategory(dto: z.infer<typeof createCategorySchema>) {
  return prisma.category.create({
    data: {
      slug: dto.slug,
      title: dto.title,
      sortOrder: dto.sortOrder ?? 0,
      active: dto.active ?? true,
    },
  });
}

export async function updateCategory(id: string, dto: z.infer<typeof updateCategorySchema>) {
  await getCategory(id);
  return prisma.category.update({ where: { id }, data: dto });
}

export async function removeCategory(id: string) {
  await getCategory(id);
  await prisma.category.delete({ where: { id } });
  return { ok: true };
}

/* ————————————————————————— sorular ————————————————————————— */

/**
 * Prisma Json — çoktan seçmede dizi `["A","B"]` veya nesne şekilleri kabul edilir
 * (bkz. 7cb9603: admin panelinden dizi gönderimi 400 alıyordu).
 */
const choicesJsonSchema = z
  .union([
    z.array(z.union([z.string(), z.record(z.unknown())])),
    z.record(z.unknown()),
    z.null(),
  ])
  .optional();

export const createQuestionSchema = z.object({
  categoryId: z.string().uuid(),
  phase: z.nativeEnum(QuestionPhase),
  type: z.nativeEnum(QuestionType).optional(),
  prompt: z.string().min(1).max(2000),
  choicesJson: choicesJsonSchema,
  orderIndex: z.number().int().optional(),
  weight: z.number().int().optional(),
  status: z.nativeEnum(QuestionStatus).optional(),
  mapsToQuestionId: z.string().uuid().nullable().optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

async function assertCategory(id: string) {
  const c = await prisma.category.findUnique({ where: { id } });
  if (!c) throw notFound('Category not found');
}

async function assertMapsValid(
  categoryId: string,
  phase: QuestionPhase,
  mapsToQuestionId?: string | null,
) {
  if (phase !== QuestionPhase.game) {
    if (mapsToQuestionId) {
      throw badRequest('mapsToQuestionId is only valid for game questions');
    }
    return;
  }
  if (!mapsToQuestionId) return;
  const target = await prisma.question.findFirst({
    where: { id: mapsToQuestionId, categoryId, phase: QuestionPhase.profile },
  });
  if (!target) {
    throw badRequest('mapsToQuestionId must reference a profile question in the same category');
  }
}

export async function listQuestionsByCategory(categoryId: string | null) {
  if (!categoryId) throw badRequest('categoryId query parameter is required');
  await assertCategory(categoryId);
  return prisma.question.findMany({
    where: { categoryId },
    orderBy: [{ phase: 'asc' }, { orderIndex: 'asc' }],
  });
}

export async function getQuestion(id: string) {
  const q = await prisma.question.findUnique({ where: { id } });
  if (!q) throw notFound('Question not found');
  return q;
}

export async function createQuestion(dto: z.infer<typeof createQuestionSchema>) {
  await assertCategory(dto.categoryId);
  await assertMapsValid(dto.categoryId, dto.phase, dto.mapsToQuestionId);
  return prisma.question.create({
    data: {
      categoryId: dto.categoryId,
      phase: dto.phase,
      type: dto.type ?? undefined,
      prompt: dto.prompt,
      choicesJson: (dto.choicesJson as Prisma.InputJsonValue) ?? undefined,
      orderIndex: dto.orderIndex ?? 0,
      weight: dto.weight ?? 1,
      status: dto.status ?? QuestionStatus.draft,
      mapsToQuestionId: dto.mapsToQuestionId ?? null,
    },
  });
}

export async function updateQuestion(id: string, dto: z.infer<typeof updateQuestionSchema>) {
  const existing = await getQuestion(id);
  const categoryId = dto.categoryId ?? existing.categoryId;
  const phase = dto.phase ?? existing.phase;
  await assertMapsValid(categoryId, phase, dto.mapsToQuestionId ?? existing.mapsToQuestionId);
  if (dto.categoryId) await assertCategory(dto.categoryId);

  return prisma.question.update({
    where: { id },
    data: {
      ...dto,
      choicesJson:
        dto.choicesJson === undefined ? undefined : (dto.choicesJson as Prisma.InputJsonValue),
    },
  });
}

export async function removeQuestion(id: string) {
  await getQuestion(id);
  await prisma.question.delete({ where: { id } });
  return { ok: true };
}
