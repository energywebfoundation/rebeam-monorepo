import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Providers } from '../types/symbols';
import { LoggerService } from '../logger/logger.service';
import { OcnApiService } from './ocn-api.service';
import { OcnDbService } from './ocn-db.service';
import { OcnService } from './ocn.service';

describe('OcnService', () => {
  let service: OcnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcnService,
        LoggerService,
        OcnApiService, // TODO: stub
        OcnDbService, // TODO: stub
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              ({
                'ocn.ocpiServerPort': '8080',
                'ocn.signer':
                  '49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b',
              }[key]),
          },
        },
        {
          provide: Providers.OCN_BRIDGE,
          inject: [
            LoggerService,
            ConfigService,
            OcnApiService,
            OcnDbService,
          ],
          useFactory: () => { return },
        }
      ],
    }).compile();

    service = module.get<OcnService>(OcnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
