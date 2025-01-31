import { OcnConfig, OcnEnvironmentName, ServerConfig } from './types';

export default (): {
  server: ServerConfig;
  ocn: OcnConfig;
} => ({
  server: {
    port: process.env.SERVER_PORT,
  },
  ocn: {
    ocpiServerBaseUrl: process.env.OCN_OCPI_SERVER_BASE_URL,
    ocpiServerPort: process.env.OCN_OCPI_SERVER_PORT,
    signer: process.env.OCN_SIGNER,
    environment: process.env.OCN_ENVIRONMENT as OcnEnvironmentName,
    useSignatures: process.env.OCN_SIGNATURES === 'true',
    loggingEnabled: process.env.LOGGING_ENABLED === 'true',
  },
});
