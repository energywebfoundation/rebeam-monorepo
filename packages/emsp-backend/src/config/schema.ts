import * as Joi from 'joi';

export default () =>
  Joi.object({
    SERVER_PORT: Joi.number().required(),
    /**
     * OCN ENV VARS
     */
    OCN_OCPI_SERVER_PORT: Joi.number().required(),
    OCN_SIGNER: Joi.string().hex().length(64).required(),
  });
