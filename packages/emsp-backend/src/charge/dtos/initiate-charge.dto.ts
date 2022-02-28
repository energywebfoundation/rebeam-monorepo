import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class InitiateChargeDTO {
  @ApiProperty({ type: String })
  ocpiToken: string;

  static validate(dto: InitiateChargeDTO) {
    Joi.assert(
      dto,
      Joi.object({
        ocpiToken: Joi.string().uuid().required(),
      })
    );
  }
}
