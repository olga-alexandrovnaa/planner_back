import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsNumberOrNull } from '../../decorators/IsNumberOrNull.decorator';

export class CreateProductDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberOrNull()
  readonly typeId?: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly measureUnitId: number;
}
