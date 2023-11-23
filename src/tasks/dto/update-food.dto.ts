import { ApiPropertyOptional } from '@nestjs/swagger';
import { FoodType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsStringOrNull } from '../../decorators/IsStringOrNull.decorator';
import { IsNumberOrNull } from '../../decorators/IsNumberOrNull.decorator';
import { IngregientDto } from './ingredient.dto';

export class UpdateFoodDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumberOrNull()
  readonly proteins: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumberOrNull()
  readonly fats: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumberOrNull()
  readonly carbohydrates: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumberOrNull()
  readonly calories: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly recipe?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly foodType?: FoodType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => IngregientDto)
  @ValidateNested()
  readonly ingredients?: IngregientDto[];
}
