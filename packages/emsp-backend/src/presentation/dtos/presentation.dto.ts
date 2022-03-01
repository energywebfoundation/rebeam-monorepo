import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { IsString } from 'class-validator';

export class PresentationLinkDTO {
  @ApiProperty({ type: String })
  @IsString()
  type: string;

  @ApiProperty({ type: String })
  @IsString()
  url: string;

  @ApiProperty({ type: String })
  @IsString()
  ssiSession: string;
}

export class PresentationDTO {
  @ApiProperty({ type: PresentationLinkDTO })
  presentationLink: PresentationLinkDTO;

  @ApiProperty({ type: String })
  @IsString()
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
