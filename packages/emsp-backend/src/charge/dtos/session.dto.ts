import { ApiProperty } from '@nestjs/swagger';

export class SessionDTO {
  @ApiProperty({ type: String })
  party_id: string;

  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  start_date_time: string;

  @ApiProperty({ type: String })
  end_date_time: string;

  @ApiProperty({ type: String })
  kwh: string;

  @ApiProperty({ type: String })
  location_id: string;

  @ApiProperty({ type: String })
  evse_uid: string;

  @ApiProperty({ type: String })
  connector_id: string;

  @ApiProperty({ type: String })
  currency?: string;

  @ApiProperty({ type: String })
  total_cost: string;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: String })
  last_updated: string;
}
