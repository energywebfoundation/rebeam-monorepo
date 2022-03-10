import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OcpiPartyDTO {
  @ApiProperty({ type: String, example: 'DE' })
  @IsString()
  countryCode: string;

  @ApiProperty({ type: String, example: 'CPO' })
  @IsString()
  partyId: string;
}
