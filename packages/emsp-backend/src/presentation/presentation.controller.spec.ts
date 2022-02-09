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
    it('should return the presentation information', () => {
      const presentationInfo = {
        presentationLink: {
          type: 'presType',
          url: 'mockUrl',
          ssiSession: 'ssiSession',
        },
        ocpiTokenUID: 'tokenUUID',
      };
      expect(presController.present(presentationInfo)).toBe(presentationInfo);
    });
  });
});
