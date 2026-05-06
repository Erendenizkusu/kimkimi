import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  hostDisplayName!: string;
}
