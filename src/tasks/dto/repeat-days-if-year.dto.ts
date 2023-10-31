import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

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
}
