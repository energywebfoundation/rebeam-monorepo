import { ApiProperty } from '@nestjs/swagger';

export class ConnectionDto {
  @ApiProperty()
  connected: boolean;
}
