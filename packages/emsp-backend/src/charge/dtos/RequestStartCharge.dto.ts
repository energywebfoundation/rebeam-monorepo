import { ApiProperty } from '@nestjs/swagger';

export class RequestStartChargeDTO {
  @ApiProperty({ type: String })
  locationId: string;
}
