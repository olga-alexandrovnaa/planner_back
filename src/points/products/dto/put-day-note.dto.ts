import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class PutDayNoteDto {
  @ApiProperty()
  @Transform(({ value }) => String(value))
  @IsString()
  readonly note: string;
}
