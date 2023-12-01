import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsStringOrNull } from '../../../decorators/IsStringOrNull.decorator';

export class UpdateBuyingDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsOptional()
  @IsStringOrNull()
  readonly note?: string;

  @ApiProperty()
  @Transform(({ value }) => Boolean(value))
  @IsOptional()
  @IsBoolean()
  readonly checked?: boolean;
}
