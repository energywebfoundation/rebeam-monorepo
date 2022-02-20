import { ApiProperty } from '@nestjs/swagger';
import { ICdrToken, IChargingPeriod, IPrice } from '@energyweb/ocn-bridge';

class Price {
  @ApiProperty({ type: Number, example: 100 })
  excl_vat: number;

  @ApiProperty({ type: Number, example: 100 })
  incl_vat?: number;
}

export class SessionDTO {
  @ApiProperty({ type: String, example: '456abc' })
  party_id: string;

  @ApiProperty({ type: String, example: 'uuid' })
  id: string;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  start_date_time: Date;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  end_date_time: Date;

  @ApiProperty({ type: Number, example: 100 })
  kwh: number;

  @ApiProperty({ type: String, example: '124abc' })
  location_id: string;

  @ApiProperty({ type: String, example: '124abc' })
  connector_id: string;

  @ApiProperty({ type: String, example: 'EUR' })
  currency?: string;

  @ApiProperty({ type: Price })
  total_cost: Price;

  @ApiProperty({ type: String, example: 'charged' })
  status: string;

  @ApiProperty({ type: String, example: 'de-DE' })
  country_code: string;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  last_updated: Date;
}
