import {
  Body,
  Controller,
  Post,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';

@ApiTags('Invoice')
@Controller('invoice')

export class InvoiceController {
  constructor(private readonly logger: LoggerService) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Log received invoice information',
  })
  @ApiResponse({ status: 200 })
  async logInvoice(@Body() data: {[key: string]: any}) {
    this.logger.log(`Invoice Data: ${JSON.stringify(data)}`);
  }
}
