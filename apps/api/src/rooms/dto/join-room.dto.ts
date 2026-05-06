import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class JoinRoomDto {
  @Transform(({ value }) => String(value ?? '').toUpperCase())
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  @Matches(/^[A-Z2-9]+$/)
  shortCode!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  guestDisplayName!: string;
}
