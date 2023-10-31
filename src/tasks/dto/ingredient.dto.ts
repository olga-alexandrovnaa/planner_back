import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class IngregientDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly trackerId: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly productId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  
  readonly measureUnitId?: number;
}
