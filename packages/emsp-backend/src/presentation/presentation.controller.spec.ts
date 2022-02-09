import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { CacheModule, Logger } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { PresentationService } from './presentation.service';
describe('PresentationController', () => {
  let presController: PresentationController;
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
      expect(result).toBe(presentationInfo);
    });
    it('should fetch the cache given a uuid', async () => {
      const id = presentationInfo.ocpiTokenUID;
      const result = await presController.fetchPresentationData(id);
      expect(result).toBe(presentationInfo);
    });
  });
});
