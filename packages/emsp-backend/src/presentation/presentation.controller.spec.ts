import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';

describe('PresentationController', () => {
  let presController: PresentationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
    }).compile();

    presController = app.get<PresentationController>(PresentationController);
  });

  describe('root', () => {
    it('should return the presentation information', async () => {
      const presentationInfo = {
        presentationLink: {
          type: 'presType',
          url: 'mockUrl',
          ssiSession: 'ssiSession',
        },
        ocpiTokenUID: 'tokenUUID',
      };
      const result = await presController.present(presentationInfo);
      expect(result).toBe(presentationInfo);
    });
  });
});
