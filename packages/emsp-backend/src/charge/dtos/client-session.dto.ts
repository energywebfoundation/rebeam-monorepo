import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class ClientSessionDTO {
  @ApiProperty({ type: Date })
  @IsDate()
  start_date_time: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  kwh?: number;

  @ApiProperty({ type: String })
  @IsString()
  formattedCost?: string;

  @ApiProperty({ type: Date })
  @IsDate()
  last_updated: Date;

  @ApiProperty({ type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  formattedStartTime: string;
}
