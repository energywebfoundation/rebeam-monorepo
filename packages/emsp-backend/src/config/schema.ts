import * as Joi from 'joi';

export default () =>
  Joi.object({
    SERVER_PORT: Joi.number().required(),
    /**
     * OCN ENV VARS
     */
    OCN_OCPI_SERVER_BASE_URL: Joi.string().uri().required(),
    OCN_OCPI_SERVER_PORT: Joi.number().required(),
    OCN_SIGNER: Joi.string().hex().length(64).required(),
    OCN_ENVIRONMENT: Joi.string().valid('docker', 'local', 'volta').required()
  });
