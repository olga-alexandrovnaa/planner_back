import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class RegisterUserDTO {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  readonly userName: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => String(value))
  readonly password: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  readonly name: string;
}
