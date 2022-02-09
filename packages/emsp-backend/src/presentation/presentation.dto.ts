import { ApiProperty } from '@nestjs/swagger';

export class PresentationLinkDTO {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  ssiSession: string;
}

export class PresentationDTO {
  @ApiProperty({ type: PresentationLinkDTO })
  presentationLink: PresentationLinkDTO;

  @ApiProperty({ type: String })
  ocpiTokenUID: string;
}
