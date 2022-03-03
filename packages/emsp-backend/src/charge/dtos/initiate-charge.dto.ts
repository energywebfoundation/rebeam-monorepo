import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateChargeDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ocpiToken: string;
}
