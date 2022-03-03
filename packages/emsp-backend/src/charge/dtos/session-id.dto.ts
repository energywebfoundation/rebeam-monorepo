import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SessionIdDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
