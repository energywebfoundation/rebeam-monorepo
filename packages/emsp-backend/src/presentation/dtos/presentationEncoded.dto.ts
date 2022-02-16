import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class PresentationEncodedDTO {
  @ApiProperty({ type: String })
  presentationLinkEncoded: string;

  static validate(dto: PresentationEncodedDTO) {
    Joi.assert(
      dto,
      Joi.object({
        presentationLinkEncoded: Joi.string().required(),
      })
    );
  }
}
