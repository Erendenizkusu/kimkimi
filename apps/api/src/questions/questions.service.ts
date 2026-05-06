import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, QuestionPhase, QuestionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCategory(id: string) {
    const c = await this.prisma.category.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Category not found');
  }

  private async assertMapsValid(categoryId: string, phase: QuestionPhase, mapsToQuestionId?: string | null) {
    if (phase !== QuestionPhase.game) {
      if (mapsToQuestionId) {
        throw new BadRequestException('mapsToQuestionId is only valid for game questions');
      }
      return;
    }
    if (!mapsToQuestionId) return;
    const target = await this.prisma.question.findFirst({
      where: { id: mapsToQuestionId, categoryId, phase: QuestionPhase.profile },
    });
    if (!target) {
      throw new BadRequestException('mapsToQuestionId must reference a profile question in the same category');
    }
  }

  async listByCategory(categoryId: string) {
    if (!categoryId) throw new BadRequestException('categoryId query parameter is required');
    await this.assertCategory(categoryId);
    return this.prisma.question.findMany({
      where: { categoryId },
      orderBy: [{ phase: 'asc' }, { orderIndex: 'asc' }],
    });
  }

  async get(id: string) {
    const q = await this.prisma.question.findUnique({ where: { id } });
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async create(dto: CreateQuestionDto) {
    await this.assertCategory(dto.categoryId);
    await this.assertMapsValid(dto.categoryId, dto.phase, dto.mapsToQuestionId);
    return this.prisma.question.create({
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

  async update(id: string, dto: UpdateQuestionDto) {
    const existing = await this.get(id);
    const categoryId = dto.categoryId ?? existing.categoryId;
    const phase = dto.phase ?? existing.phase;
    await this.assertMapsValid(categoryId, phase, dto.mapsToQuestionId ?? existing.mapsToQuestionId);

    if (dto.categoryId) await this.assertCategory(dto.categoryId);

    return this.prisma.question.update({
      where: { id },
      data: {
        ...dto,
        choicesJson:
          dto.choicesJson === undefined ? undefined : (dto.choicesJson as Prisma.InputJsonValue),
      },
    });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.question.delete({ where: { id } });
    return { ok: true };
  }
}
