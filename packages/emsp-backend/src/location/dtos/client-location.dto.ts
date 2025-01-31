import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Operator {
  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
export class Property {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  partyId: string;

  @ApiProperty({ type: String })
  @IsString()
  countryCode: string;

  @ApiProperty({ type: String })
  @IsString()
  stationName: string;

  @ApiProperty({ type: String })
  @IsString()
  formattedAddress: string;

  @ApiProperty({ type: String })
  @IsString()
  country: string;

  @ApiProperty({ type: String })
  evses: string;

  @ApiProperty({ type: Object })
  operator: Operator;
}

export class ClientLocation {
  @ApiProperty({ type: Object })
  properties: Property;

  @ApiProperty({ type: Object })
  geometry: Geometry;
}

export class Geometry {
  @ApiProperty({ type: Array })
  coordinates: number[];
}

export class ClientLocationsDTO {
  @ApiProperty({ type: Array })
  locations: ClientLocation[];
}
