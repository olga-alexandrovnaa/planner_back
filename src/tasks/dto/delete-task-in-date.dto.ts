import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class DeleteTaskInDateDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;
}
