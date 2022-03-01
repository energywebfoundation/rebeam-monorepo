import { ApiProperty } from '@nestjs/swagger';
import {IsString} from "class-validator";
import * as Joi from 'joi';

export class RegisterDto {
  @ApiProperty({ example: 'http://localhost:8080' })
  @IsString()
  nodeURL: string;

  @ApiProperty({ example: 'uuid' })
  @IsString()
  tokenA: string;

  static validate(dto: RegisterDto) {
    Joi.assert(
      dto,
      Joi.object({
        nodeURL: Joi.string().uri().required(),
        tokenA: Joi.string().uuid().required(),
      })
    );
  }
}
