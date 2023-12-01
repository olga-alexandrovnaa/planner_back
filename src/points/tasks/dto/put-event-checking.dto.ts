import { ApiProperty } from '@nestjs/swagger';

export class PutEventCheckingDto {
  @ApiProperty()
  readonly dates: string[];
}
