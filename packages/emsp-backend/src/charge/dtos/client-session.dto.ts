import { ApiProperty } from '@nestjs/swagger';

export class ClientSessionDTO {
  @ApiProperty({ type: Date })
  start_date_time: Date;

  @ApiProperty({ type: Number })
  kwh?: number;

  @ApiProperty({ type: String })
  formattedCost?: string;

  @ApiProperty({ type: Date })
  last_updated: Date;

  @ApiProperty({ type: String })
  id: string;
}
