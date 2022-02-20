import { ApiProperty } from '@nestjs/swagger';

export class BasicDTO {
  @ApiProperty({ type: String })
  locationId: string;
}
