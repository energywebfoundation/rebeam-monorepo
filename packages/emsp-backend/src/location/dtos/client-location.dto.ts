import { ApiProperty } from '@nestjs/swagger';
import { IEvse } from '@energyweb/ocn-bridge';

export class Operator {
  @ApiProperty({ type: String })
  name: string;
}
export class Property {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  stationName: string;
  @ApiProperty({ type: String })
  formattedAddress: string;
  @ApiProperty({ type: String })
  country: string;
  @ApiProperty({ type: Array })
  evses: IEvse[];
  @ApiProperty({ type: Object })
  operator: Operator;
}

export class ClientLocation {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: Object })
  properties: Property;

  @ApiProperty({ type: Object })
  geometry: Geometry;
}

export class Geometry {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: Array })
  coordinates: number[];
}

export class ClientLocationsDTO {
  @ApiProperty({ type: Array })
  locations: ClientLocation[];
}
