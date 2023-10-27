import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export enum tasksType {
  all,
  outcome,
  income,
  food,
  trackers,
}
export class GetDayTasksDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly type: tasksType;
}
