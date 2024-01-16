import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { IsStringOrNull } from '../../../decorators/IsStringOrNull.decorator';
import { IngregientDto } from './ingredient.dto';

export class RecipeStepDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly stepNumber: number;

  @ApiProperty()
  @Transform(({ value }) => (value ? String(value).trim() : null))
  @IsStringOrNull()
  readonly recipe?: string;

  @ApiProperty()
  @Type(() => IngregientDto)
  @ValidateNested()
  readonly ingredients?: IngregientDto[];
}
