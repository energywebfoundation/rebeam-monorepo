import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConnectionDto {
  @ApiProperty()
  @IsBoolean()
  connected: boolean;
}
