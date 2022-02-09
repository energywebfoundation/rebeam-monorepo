import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import {CacheModule} from '@nestjs/common';
describe('PresentationController', () => {
  let presController: PresentationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      imports: [CacheModule.register({
        ttl: 0
      })]
    }).compile();

    presController = app.get<PresentationController>(PresentationController);
  });

  describe('post present', () => {
    it('should return the presentation information that is cached', async () => {
      const presentationInfo = {
        presentationLink: {
          type: 'string',
          url: 'string',
          ssiSession: 'string',
        },
        ocpiTokenUID: 'test5',
      };
      
      const result = await presController.present(presentationInfo);
      expect(result).toBe(presentationInfo.toString());
    });
  });

  describe('get id', () => {
    it('should return the presentation information that is cached', async () => {
    const presentationInfo = {
            presentationLink: {
              type: 'string',
              url: 'string',
              ssiSession: 'string',
            },
            ocpiTokenUID: 'test5',
          };
      const id = 'test5'
      const result = await presController.getPresentationData(id);
      expect(result).toBe(presentationInfo.toString());
    });
  });
});
