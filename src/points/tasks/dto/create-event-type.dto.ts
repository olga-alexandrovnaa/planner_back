import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateEventTypeDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name: string;
}
