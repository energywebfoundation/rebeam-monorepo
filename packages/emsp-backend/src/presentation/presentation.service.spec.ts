import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

describe('ChargeService', () => {
  let presService: PresentationService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationService, LoggerService],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
    }).compile();

    presService = module.get<PresentationService>(PresentationService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(presService).toBeDefined();
  });

  describe('fetch and set presentation cache', () => {
    const presentationMockData = {
      presentationLink: {
        type: 'string',
        url: 'string',
        ssiSession: 'string',
      },
      ocpiTokenUID: 'test5',
    };
    it('should cache presentation data and return the cached value', async () => {
      const result = await presService.cachePresentation(presentationMockData);
      expect(result).toEqual(presentationMockData);
    });

    it('should fetch presentation data given and base64 the fetched data', async () => {
      const pres = {
        presentationLink: {
          type: 'string',
          url: 'string',
          ssiSession: 'string',
        },
        ocpiTokenUID: 'test6',
      };
      await cache.set('test6-present', pres);
      const result = await presService.fetchPresentation('test6');
      expect(result).toBeTruthy();
    });
  });
});
