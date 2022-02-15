import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { CacheModule } from '@nestjs/common';
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
          ttl: +process.env.TTL_CACHE,
        }),
      ],
    }).compile();

    presController = app.get<PresentationController>(PresentationController);
    cache = app.get<Cache>(CACHE_MANAGER);
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
      };

      const linkEncoded = {
        presentationLinkEncoded:
          'eyJwcmVzZW50YXRpb25MaW5rIjp7InR5cGUiOiJzdHJpbmciLCJ1cmwiOiJzdHJpbmciLCJzc2lTZXNzaW9uIjoic3RyaW5nIn0sIm9jcGlUb2tlblVJRCI6InRlc3Q2In0=',
      };

      const { ocpiTokenUID } = data;
      await cache.set(ocpiTokenUID, data);
      const result = await presController.fetchPresentationData(ocpiTokenUID);
      expect(result).toEqual(linkEncoded);
    });
  });
});
