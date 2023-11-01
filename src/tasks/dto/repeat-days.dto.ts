import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoveTypeIfDayNotExists, WeekNumber } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IsNumberOrNull } from '../../decorators/IsNumberOrNull.decorator';
import { IsStringOrNull } from '../../decorators/IsStringOrNull.decorator';

export class RepeatDaysDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly trackerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly intervalPartIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly dayFromBeginningInterval?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly weekNumber?: WeekNumber;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly weekDayNumber?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly moveTypeIfDayNotExists?: MoveTypeIfDayNotExists;
}
