import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly name: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly userName: string;

  @ApiProperty()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  readonly password: string;
}
