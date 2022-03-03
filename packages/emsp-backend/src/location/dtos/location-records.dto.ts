import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LocationRecordsDTO {
  @ApiProperty({ type: Number, example: 'DE' })
  @IsNumber()
  numLocations: number;
}
