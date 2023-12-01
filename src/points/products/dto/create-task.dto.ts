import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntervalType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RepeatDayTaskCheckDto } from './task-repeat-day-check.dto';
import { RepeatDaysDto } from './repeat-days.dto';
import { RepeatDaysIfYearDto } from './repeat-days-if-year.dto';
import { IsStringOrNull } from '../../../decorators/IsStringOrNull.decorator';
import { IsNumberOrNull } from '../../../decorators/IsNumberOrNull.decorator';

export class CreateTaskDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isTracker?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly foodId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly outcomeTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly incomeTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly foodCountToPrepare?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly foodCout?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly intervalPart?: IntervalType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly intervalLength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly repeatCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly moneyIncomePlan?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly moneyOutcomePlan?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isFood?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDaysIfYearDto)
  @ValidateNested()
  readonly repeatIfYearIntervalDays?: RepeatDaysIfYearDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDaysDto)
  @ValidateNested()
  readonly repeatDays?: RepeatDaysDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDayTaskCheckDto)
  @ValidateNested()
  readonly taskRepeatDayCheck?: RepeatDayTaskCheckDto[];

  @ApiPropertyOptional()
  @IsOptional()
  readonly taskBuyings?: number[];
}
