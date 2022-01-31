export type ServerConfig = {
  port: string;
}

export type OcnEnvironmentName = 'local' | 'docker' | 'volta'

export type OcnConfig = {
  ocpiServerBaseUrl: string;
  ocpiServerPort: string;
  signer: string;
  environment: OcnEnvironmentName;
}
