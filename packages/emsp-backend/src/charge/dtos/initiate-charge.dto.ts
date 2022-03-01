import {IsNotEmpty, IsString} from 'class-validator';

export class InitiateChargeDTO {
  @IsString()
  @IsNotEmpty()
  ocpiToken: string;

}
