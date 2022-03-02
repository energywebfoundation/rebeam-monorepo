import { ApiProperty } from '@nestjs/swagger';

export class OcpiPartyDTO {
  @ApiProperty({ type: String, example: "DE" })
  countryCode: string;

  @ApiProperty({ type: String, example: "CPO" })
  partyId: string;
}
