import { ApiProperty } from '@nestjs/swagger';

export class PresentationDTO {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  ssiSession: string;
}
