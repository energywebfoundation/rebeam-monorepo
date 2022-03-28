import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { LoggerService } from '../logger/logger.service';
describe('InvoiceController', () => {
  let invoiceController: InvoiceController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [LoggerService],
    }).compile();

    invoiceController = app.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(invoiceController).toBeDefined();
  });
});