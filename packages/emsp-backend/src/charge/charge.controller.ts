import { Controller, Post, Get, HttpCode, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { ChargeService } from './charge.service';
import { InitiateChargeDTO } from './dtos/initiate-charge.dto';
import { ICommandResult, ISession } from '@energyweb/ocn-bridge';
import { Session } from '../ocn/schemas/session.schema';
import { RequestStartChargeDTO } from './dtos/RequestStartCharge.dto';

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
  async startCharge(
    @Body() body: RequestStartChargeDTO
  ): Promise<InitiateChargeDTO> {
    try {
      const { locationId } = body;
      const token = await this.service.initiate(locationId);
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

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch charge session updates',
  })
  @ApiResponse({ status: 200, type: Session })
  async getChargeSessionData(sessionId: string): Promise<Session> {
    try {
      const sessionData = await this.service.fetchSessionData(sessionId);
      return sessionData;
    } catch (err) {
      this.logger.error(`Cannot generate OCPI token`);
      throw new ApiError(
        ApiErrorCode.CHARGE_SESSION,
        'Failure to fetch charge session data',
        err.message
      );
    }
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch start charge session confirmation',
  })
  @ApiResponse({ status: 200, type: Session })
  async getChargeSessionConfirmation(
    sessionId: string
  ): Promise<ICommandResult | null> {
    try {
      const sessionData = await this.service.fetchSessionConfirmation(
        sessionId
      );
      return sessionData;
    } catch (err) {
      this.logger.error(`Cannot generate OCPI token `);
      throw new ApiError(
        ApiErrorCode.CHARGE_SESSION,
        'Failure to fetch charge session confirmation',
        err.message
      );
    }
  }
}
