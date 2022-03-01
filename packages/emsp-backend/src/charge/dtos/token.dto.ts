import { ApiProperty } from '@nestjs/swagger';
import {IsString} from "class-validator";

export class TokenDTO {
  @ApiProperty({ type: String })
  @IsString()
  ocpiToken: string;
}
