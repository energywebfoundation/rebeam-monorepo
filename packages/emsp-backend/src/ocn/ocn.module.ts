import {
  IBridge,
  startBridge,
  ModuleImplementation,
} from '@energyweb/ocn-bridge';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet } from '@ethersproject/wallet';
import { LoggerService } from 'src/logger/logger.service';
import { Providers } from 'src/types/symbols';
import { OcnApiService } from './ocn-api.service';
import { OcnDbService } from './ocn-db.service';
import { OcnService } from './ocn.service';

@Module({
  providers: [
    OcnApiService,
    OcnDbService,
    ConfigService,
    {
      provide: Providers.OCN_BRIDGE,
      inject: [OcnApiService, OcnDbService, ConfigService, LoggerService],
      useFactory: async (
        api: OcnApiService,
        db: OcnDbService,
        config: ConfigService,
        logger: LoggerService
      ): Promise<IBridge> => {
        const port = +config.get('ocn.ocpiServerPort');
        const signer = config.get('ocn.signer');
        const { address } = new Wallet(signer);
        logger.log(
          `Starting OCPI Server with OCN signer(${address})`,
          Providers.OCN_BRIDGE
        );
        const bridge = await startBridge({
          // needed for OCPI versions endpoint (OCN Node can find our endpoints)
          publicBridgeURL: '',
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
          // needed to type-check the provided "pluggableAPI"
          modules: {
            implementation: ModuleImplementation.CUSTOM,
            sender: ['commands'],
            receiver: ['locations', 'sessions', 'cdrs'],
          },
          // the OCPI server's module implementation
          pluggableAPI: api,
          // db wrapper for authentication tokens and endpoints
          pluggableDB: db,
          // sign OCPI messages with signer key
          signatures: true,
          // private key used to sign messages
          signer: config.get('ocn.signer'),
          // do not attempt to automatically register to an OCN Node
          // (prefer manual: issues with network orchestration otherwise)
          dryRun: true,
          // defines the port the embedded OCPI server runs on
          port,
          // log incoming requests
          logger: true,
        });
        logger.log(`Started OCPI Server on port ${port}`, Providers.OCN_BRIDGE);
        return bridge;
      },
    },
    OcnService,
  ],
})
export class OcnModule {}
