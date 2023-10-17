import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class TokenData {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Transform(({ value }) => Number(value))
  id: number;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  name: string;

  @IsString()
  @Transform(({ value }) => String(value).trim())
  userName: string;
}
