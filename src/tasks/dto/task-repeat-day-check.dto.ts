import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { IsStringOrNull } from '../../decorators/IsStringOrNull.decorator';
import { IsNumberOrNull } from '../../decorators/IsNumberOrNull.decorator';

export class RepeatDayTaskCheckDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly trackerId: number;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly newDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly checked?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly note?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly moneyIncomeFact?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly moneyOutcomeFact?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly deadline?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly isDeleted?: boolean;
}
