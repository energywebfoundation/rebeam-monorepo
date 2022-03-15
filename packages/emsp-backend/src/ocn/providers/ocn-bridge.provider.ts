import {
  DefaultRegistry,
  IBridge,
  ModuleImplementation,
  startBridge,
} from '@energyweb/ocn-bridge';
import { Wallet } from '@ethersproject/wallet';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OcnConfig } from '../../config/types';
import { LoggerService } from '../../logger/logger.service';
import { Providers } from '../../types/symbols';
import { OcnApiService } from '../services/ocn-api.service';
import { OcnDbService } from '../services/ocn-db.service';

export const OcnBridgeProvider: FactoryProvider<Promise<IBridge>> = {
  provide: Providers.OCN_BRIDGE,
  inject: [OcnApiService, OcnDbService, ConfigService, LoggerService],
  useFactory: async (
    api: OcnApiService,
    db: OcnDbService,
    config: ConfigService,
    logger: LoggerService
  ): Promise<IBridge> => {
    const ocnConfig = config.get<OcnConfig>('ocn');
    const { address } = new Wallet(ocnConfig.signer);
    logger.log(
      `Starting OCPI Server with OCN signer(${address})`,
      Providers.OCN_BRIDGE
    );
    const bridge = await startBridge({
      // base url needed to create the server's OCPI endpoints
      // (so OCN Node can find our endpoints)
      publicBridgeURL: ocnConfig.ocpiServerBaseUrl,
      // sets the "OCPI-From-*" headers in requests to OCN Node
      roles: [
        {
          country_code: 'DE',
          party_id: 'REB',
          role: 'EMSP',
          business_details: {
            name: 'ReBeam eMSP',
          },
        },
      ],
      // needed to type-check the provided "pluggableAPI" and tell OCN node
      // which modules we support
      modules: {
        implementation: ModuleImplementation.CUSTOM,
        sender: ['commands'],
        receiver: ['locations', 'sessions', 'cdrs'],
      },
      // the OCPI server's module implementation
      pluggableAPI: api,
      // db wrapper for authentication tokens and endpoints
      pluggableDB: db,
      // OCN Registry used in registration
      pluggableRegistry: new DefaultRegistry(
        ocnConfig.environment,
        ocnConfig.signer
      ),
      // sign OCPI messages with signer key
      signatures: ocnConfig.useSignatures,
      // private key used to sign messages
      signer: ocnConfig.signer,
      // defines the port the embedded OCPI server runs on
      port: +ocnConfig.ocpiServerPort,
      // log incoming requests
      logger: true,
    });
    console.log(ocnConfig.useSignatures, 'SIGNATURES');
    logger.log(
      `Started OCPI Server on port ${ocnConfig.ocpiServerPort}`,
      Providers.OCN_BRIDGE
    );
    return bridge;
  },
};
