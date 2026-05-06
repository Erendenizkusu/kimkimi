import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { QuestionPhase, QuestionStatus, QuestionType } from '@prisma/client';

export class CreateQuestionDto {
  @IsUUID()
  categoryId!: string;

  @IsEnum(QuestionPhase)
  phase!: QuestionPhase;

  @IsOptional()
  @IsEnum(QuestionType)
  type?: QuestionType;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  prompt!: string;

  @IsOptional()
  @IsObject()
  choicesJson?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsEnum(QuestionStatus)
  status?: QuestionStatus;

  @IsOptional()
  @IsUUID()
  mapsToQuestionId?: string | null;
}
