import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeekNumber } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly intervalPartIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly dayFromBeginningInterval?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly weekNumber?: WeekNumber;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly weekDayNumber?: number;
}
