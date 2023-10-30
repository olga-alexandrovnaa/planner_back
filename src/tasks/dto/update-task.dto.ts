import { ApiPropertyOptional } from '@nestjs/swagger';
import { IntervalType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from 'class-validator';
import { IngregientDto } from './ingredient.dto';
import { RepeatDayTaskCheckDto } from './task-repeat-day-check.dto';
import { RepeatDaysDto } from './repeat-days.dto';
import { RepeatDaysIfYearDto } from './repeat-days-if-year.dto';

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isTracker?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly intervalPart?: IntervalType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly intervalLength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly repeatCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyIncomePlan?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyOutcomePlan?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isFood?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly recipe?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => IngregientDto)
  @ValidateNested()
  readonly ingredients?: IngregientDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDaysIfYearDto)
  @ValidateNested()
  readonly repeatDays?: RepeatDaysIfYearDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDaysDto)
  @ValidateNested()
  readonly repeatIfYearIntervalDays?: RepeatDaysDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => RepeatDayTaskCheckDto)
  @ValidateNested()
  readonly taskRepeatDayCheck?: RepeatDayTaskCheckDto;
}
