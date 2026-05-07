import { QuestionPhase, QuestionStatus, QuestionType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** Prisma Json — çoktan seçmede dizi `["A","B"]` veya nesne şekilleri; @IsObject() diziyi reddediyordu. */
@ValidatorConstraint({ name: 'choicesJsonValue', async: false })
class ChoicesJsonValueConstraint implements ValidatorConstraintInterface {
  validate(v: unknown): boolean {
    if (v === undefined || v === null) return true;
    if (Array.isArray(v)) {
      return v.every((x) => typeof x === 'string' || (typeof x === 'object' && x !== null));
    }
    return typeof v === 'object' && v !== null && !Array.isArray(v);
  }
  defaultMessage(): string {
    return 'choicesJson bir JSON nesnesi veya dizi olmalı (örn. ["O","Ben"])';
  }
}

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
  @Validate(ChoicesJsonValueConstraint)
  choicesJson?: unknown;

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
