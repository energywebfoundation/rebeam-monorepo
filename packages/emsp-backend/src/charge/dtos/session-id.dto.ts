import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class SessionIdDTO {
  @ApiProperty({ type: String })
  sessionId: string;

  static validate(dto: SessionIdDTO) {
    Joi.assert(
      dto,
      Joi.object({
        sessionId: Joi.string().uuid().required(),
      })
    );
  }
}
