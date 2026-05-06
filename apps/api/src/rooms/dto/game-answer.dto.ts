import { IsDefined, IsUUID } from 'class-validator';

export class GameAnswerDto {
  @IsUUID()
  questionId!: string;

  @IsDefined()
  value!: unknown;
}
