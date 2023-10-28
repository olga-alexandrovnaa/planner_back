import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class SetTaskCheckDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiProperty()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly checked: boolean;
}
