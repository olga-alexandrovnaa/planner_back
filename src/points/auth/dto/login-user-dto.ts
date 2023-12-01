import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  readonly userName: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
