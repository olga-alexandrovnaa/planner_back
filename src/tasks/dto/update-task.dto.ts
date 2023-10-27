import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Ingregient,
  IntervalType,
  RepeatDayTaskCheck,
  RepeatDayTaskWithNotYearInterval,
  RepeatDayTaskWithYearInterval,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { IngregientDto } from './ingredient.dto';
import { RepeatDayTaskCheckDto } from './task-repeat-day-check.dto';
import { RepeatDaysDto } from './repeat-days.dto';
import { RepeatDaysIfYearDto } from './repeat-days-if-year.dto';

export class UpdateTaskDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly id: number;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name: string;

  @ApiProperty()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isTracker: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly intervalPart: IntervalType;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly intervalLength: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly repeatCount: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyIncomePlan: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyOutcomePlan: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isFood: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly recipe: string;

  @ApiPropertyOptional()
  @Type(() => IngregientDto)
  @ValidateNested()
  readonly ingredients: Ingregient[];

  @ApiPropertyOptional()
  @Type(() => RepeatDaysIfYearDto)
  @ValidateNested()
  readonly repeatDays: RepeatDayTaskWithNotYearInterval[];

  @ApiPropertyOptional()
  @Type(() => RepeatDaysDto)
  @ValidateNested()
  readonly repeatIfYearIntervalDays: RepeatDayTaskWithYearInterval[];

  @ApiPropertyOptional()
  @Type(() => RepeatDayTaskCheckDto)
  @ValidateNested()
  readonly taskRepeatDayCheck: RepeatDayTaskCheck[];
}
