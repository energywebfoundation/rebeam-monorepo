import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

export class PresentationLinkDTO {
  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: String })
  ssiSession: string;
}

export class PresentationDTO {
  @ApiProperty({ type: PresentationLinkDTO })
  presentationLink: PresentationLinkDTO;

  @ApiProperty({ type: String })
  ocpiTokenUID: string;

  static validate(dto: PresentationDTO) {
    Joi.assert(
      dto,
      Joi.object({
        presentationLink: Joi.object().keys({
          type: Joi.string().required(),
          url: Joi.string().required(),
          ssiSession: Joi.string().required(),
        }),
        ocpiTokenUID: Joi.string().required(),
      })
    );
  }
}
