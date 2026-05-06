import { ArrayMinSize, IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileAnswerItemDto {
  @IsString()
  questionId!: string;

  @IsDefined()
  value!: unknown;
}

export class ProfileAnswersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProfileAnswerItemDto)
  answers!: ProfileAnswerItemDto[];
}
