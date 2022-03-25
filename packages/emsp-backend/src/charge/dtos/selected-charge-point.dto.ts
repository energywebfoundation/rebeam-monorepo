import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SelectedChargePointDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @ApiProperty({ type: String })
  @IsString()
  evseId: string;

  @ApiProperty({ type: String })
  @IsString()
  countryCode: string;

  @ApiProperty({ type: String })
  @IsString()
  partyId: string;
}
