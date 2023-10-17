import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  readonly refreshToken: string;
}
