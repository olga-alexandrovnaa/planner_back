import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class DeleteTaskDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly id: number;
}
