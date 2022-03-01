import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString} from "class-validator";

export class RequestStartChargeDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  locationId: string;
}
