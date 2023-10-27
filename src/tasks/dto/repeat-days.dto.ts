import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeekNumber } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class RepeatDaysDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly id: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly trackerId: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly intervalPartIndex: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly dayFromBeginningInterval: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly monthNummber: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly weekNumber: WeekNumber;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly weekDayNummber: number;
}
