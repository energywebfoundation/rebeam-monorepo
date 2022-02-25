import { ApiProperty } from '@nestjs/swagger';

export class SelectedChargePointDTO {
  @ApiProperty({ type: String })
  locationId: string;

  @ApiProperty({ type: String })
  evseId: string;
}
