import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { CacheModule, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';

import { LoggerService } from '../logger/logger.service';
import { PresentationService } from './presentation.service';
describe('PresentationController', () => {
  let presController: PresentationController;
  let cache: Cache;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [LoggerService, PresentationService],
      imports: [
        CacheModule.register({
          ttl: 0,
        }),
      ],
    }).compile();

    presController = app.get<PresentationController>(PresentationController);
    cache = app.get<Cache>(CACHE_MANAGER)
  });

  describe('presentation', () => {
    
    const presentationInfo = {
      presentationLink: {
        type: 'string',
        url: 'string',
        ssiSession: 'string',
      },
      ocpiTokenUID: 'test5',
    };
    it('should return the presentation information that is cached', async () => {
      const result = await presController.cachePresentation(presentationInfo);
      expect(result).toEqual(presentationInfo);
    });
    it('should fetch the cache given a uuid', async () => {
      const data = {
        presentationLink: {
          type: 'string',
          url: 'string',
          ssiSession: 'string',
        },
        ocpiTokenUID: 'test6',
      }
      
      const {ocpiTokenUID} = data;
      await cache.set(ocpiTokenUID, data)
      const result = await presController.fetchPresentationData(ocpiTokenUID);
      expect(result).toEqual(data);
    });
  });
});
