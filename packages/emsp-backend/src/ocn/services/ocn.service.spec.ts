import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../logger/logger.service';
import { OcnApiService } from './ocn-api.service';
import { OcnDbService } from './ocn-db.service';
import { OcnService } from './ocn.service';
import { OcnBridgeProvider } from '../providers/ocn-bridge.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from '../schemas/auth.schema';
import { Repository } from 'typeorm';
import { Endpoint } from '../schemas/endpoint.schema';
import { IBridge, stopBridge } from '@energyweb/ocn-bridge';
import { Providers } from '../../types/symbols';

describe('OcnService', () => {
  let service: OcnService;
  let bridge: IBridge;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Endpoint),
          useClass: Repository,
        },
        OcnService,
        LoggerService,
        OcnApiService,
        OcnDbService,
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
                  environment: 'volta',
                },
              }[key]),
          },
        },
        OcnBridgeProvider,
      ],
    }).compile();

    service = module.get<OcnService>(OcnService);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  it('should return connected status', async () => {
    jest.spyOn(bridge.registry, 'isConnectedToNode').mockResolvedValue(true);
    const { connected } = await service.getConnectionStatus();
    expect(connected).toBe(true);
  });

  it('should register the OCPI party', async () => {
    const actualUrl = 'http://localhost:8080';
    const actualToken = 'abcde-12345';
    jest
      .spyOn(bridge.registry, 'register')
      .mockImplementation(async (url, token) => {
        expect(url).toBe(actualUrl);
        expect(token).toBe(actualToken);
        return;
      });
    await service.register(actualUrl, actualToken);
  });
});
