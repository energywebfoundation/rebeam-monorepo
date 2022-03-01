import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsDate, IsInt, IsNumber, IsNotEmpty} from "class-validator";

class Price {
  @ApiProperty({ type: Number, example: 100 })
  @IsNumber()
  excl_vat: number;

  @ApiProperty({ type: Number, example: 100 })
  @IsNumber()
  incl_vat?: number;
}

export class SessionDTO {
  @ApiProperty({ type: String, example: '456abc' })
  @IsString()
  party_id: string;

  @ApiProperty({ type: String, example: 'uuid' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  @IsDate()
  start_date_time: Date;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  @IsDate()
  end_date_time: Date;

  @ApiProperty({ type: Number, example: 100 })
  @IsNumber()
  kwh: number;

  @ApiProperty({ type: String, example: '124abc' })
  @IsString()
  location_id: string;

  @ApiProperty({ type: String, example: '124abc' })
  @IsString()
  connector_id: string;

  @ApiProperty({ type: String, example: 'EUR' })
  @IsString()
  currency?: string;

  @ApiProperty({ type: Price })
  total_cost: Price;

  @ApiProperty({ type: String, example: 'charged' })
  @IsString()
  status: string;

  @ApiProperty({ type: String, example: 'de-DE' })
  @IsString()
  country_code: string;

  @ApiProperty({ type: Date, example: 'Tue Nov 16 2021 16:09:43' })
  @IsDate()
  last_updated: Date;
}
