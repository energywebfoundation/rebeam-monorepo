import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SessionDataDTO {
  @ApiProperty({ type: Number })
  @IsNumber()
  dataLength: number;

  @ApiProperty({ type: String })
  @IsString()
  data: string;
}
