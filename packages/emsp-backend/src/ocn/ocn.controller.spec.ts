import { Test, TestingModule } from '@nestjs/testing';
import { OcnController } from './ocn.controller';

describe('OcnController', () => {
  let controller: OcnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcnController],
    }).compile();

    controller = module.get<OcnController>(OcnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
