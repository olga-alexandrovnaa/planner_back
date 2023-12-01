import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { IsNumberOrNull } from '../../../decorators/IsNumberOrNull.decorator';

export class IngregientDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly productId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly measureUnitId?: number;
}
