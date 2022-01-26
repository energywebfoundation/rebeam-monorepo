import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../logger/logger.service';
import { OcnService } from './ocn.service';

describe('OcnService', () => {
  let service: OcnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcnService,
        LoggerService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              ({
                'ocn.signer':
                  '49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b',
              }[key]),
          },
        },
      ],
    }).compile();

    service = module.get<OcnService>(OcnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
