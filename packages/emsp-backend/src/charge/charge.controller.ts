import { Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { ChargeService } from './charge.service';
import { InitiateChargeDTO } from './dtos/initiate-charge.dto';
@ApiTags('Charge')
@Controller('charge')
export class ChargeController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: ChargeService
  ) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Initiate charge process',
  })
  @ApiResponse({ status: 200, type: InitiateChargeDTO })
  async startCharge(): Promise<InitiateChargeDTO> {
    try {
      const token = await this.service.initiate();
      return {
        ocpiToken: token,
      };
    } catch (err) {
      this.logger.error(`Cannot generate OCPI token `);
      throw new ApiError(
        ApiErrorCode.OCN_BRIDGE,
        'Failure to start OCPI session',
        err.message
      );
    }
  }
}
