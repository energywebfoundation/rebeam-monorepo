import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty({ type: String })
  ocpiToken: string;
}
