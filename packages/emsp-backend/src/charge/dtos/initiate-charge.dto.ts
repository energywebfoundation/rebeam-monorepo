import { ApiProperty } from '@nestjs/swagger';


export class InitiateChargeDTO {
    @ApiProperty({ type: String })
    ocpiToken: String;
  }