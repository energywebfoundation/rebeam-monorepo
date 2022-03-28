import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { PresentationDTO } from '../presentation/dtos/presentation.dto';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly logger: LoggerService) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Log received invoice information',
  })
  async logInvoice(@Body() data: PresentationDTO) {
    this.logger.log(`Invoice Data: ${JSON.stringify(data)}`);
  }
}
