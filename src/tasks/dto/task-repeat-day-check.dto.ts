import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator';

export class RepeatDayTaskCheckDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  readonly trackerId: number;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly date: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  readonly checked: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly note: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyIncomeFact: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  readonly moneyOutcomeFact: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly deadline: string;
}
