import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class ResheduleTaskDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly newDate: string;
}
