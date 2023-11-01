import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoveTypeIfDayNotExists } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IsStringOrNull } from '../../decorators/IsStringOrNull.decorator';

export class RepeatDaysIfYearDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly trackerId: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly intervalPartIndex: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly yearDateDay: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly yearDateMonth: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly moveTypeIfDayNotExists?: MoveTypeIfDayNotExists;
}
