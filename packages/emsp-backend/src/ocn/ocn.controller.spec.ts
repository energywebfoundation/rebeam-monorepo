import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from './services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnController } from './ocn.controller';
import { OcnBridgeProvider } from './providers/ocn-bridge.provider';
import { Auth } from './schemas/auth.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { OcnDbService } from './services/ocn-db.service';
import { OcnService } from './services/ocn.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { IBridge, stopBridge } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';

describe('OcnController', () => {
  let controller: OcnController;
  let bridge: IBridge;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Endpoint),
          useClass: Repository
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
            ({
              ocn: {
                ocpiServerBaseUrl: 'http://localhost:8080',
                ocpiServerPort: '8080',
                signer:
                  '49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b',
                environment: 'volta'
              }
            }[key]),
          },
        },
        LoggerService,
        OcnDbService,
        OcnApiService,
        OcnBridgeProvider,
        OcnService
      ],
      controllers: [OcnController],
    }).compile();

    controller = module.get<OcnController>(OcnController);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
