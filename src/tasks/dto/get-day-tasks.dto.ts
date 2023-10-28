import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';
import { tasksType } from '../entities/task-type.entity';

export class GetDayTasksDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly userId: number;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly type: tasksType;
}
