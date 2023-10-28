import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class TaskProgressDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly dateStart: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly dateEnd: string;
}
