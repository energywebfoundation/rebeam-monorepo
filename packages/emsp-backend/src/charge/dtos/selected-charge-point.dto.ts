import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';


export class SelectedChargePointDTO {
  @ApiProperty({ type: String })
  locationId: string;

  @ApiProperty({ type: String })
  evseId: string;

  static validate(dto: SelectedChargePointDTO) {
    Joi.assert(
      dto,
	  Joi.object({
        locationId: Joi.string().required(),
		evseId: Joi.string().required(),
      })
    );
  }
}
