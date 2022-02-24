import { Controller, Post, Get, HttpCode, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { ChargeService } from './charge.service';
import { InitiateChargeDTO } from './dtos/initiate-charge.dto';
import { ICommandResult } from '@energyweb/ocn-bridge';
import { Session } from '../ocn/schemas/session.schema';
import { RequestStartChargeDTO } from './dtos/RequestStartCharge.dto';
import { SessionDTO } from './dtos/session.dto';
import { BasicDTO } from './dtos/basic.dto';

@ApiTags('Charge')
@Controller('charge')
export class ChargeController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: ChargeService
  ) {}

  @Post('initiate')
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

  @Post('mockCreateSession')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Mock post session data',
  })
  @ApiResponse({ status: 200 })
  async postSessionData(@Body() body: SessionDTO): Promise<any> {
    try {
      const sessionData = await this.service.mockPostSessionData(body);
      return {
        data: sessionData,
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

  @Post('mockAuth')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Mock post session auth',
  })
  @ApiResponse({ status: 200 })
  async postSessionAuth(@Body() body: BasicDTO): Promise<any> {
    try {
      const sessionAuth = await this.service.mockPostSessionAuth(
        body.locationId
      );
      return sessionAuth;
    } catch (err) {
      this.logger.error(`Cannot generate OCPI token `);
      throw new ApiError(
        ApiErrorCode.OCN_BRIDGE,
        'Failure to start OCPI session',
        err.message
      );
    }
  }

  @Get('session-update/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch charge session updates',
  })
  @ApiResponse({ status: 200, type: Session })
  async getChargeSessionData(@Param('id') id: string): Promise<Session> {
    try {
      const sessionData = await this.service.fetchSessionData(id);
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

  @Get('session-conf/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch start charge session confirmation',
  })
  @ApiResponse({ status: 200, type: Session })
  async getChargeSessionConfirmation(
    @Param('id') id: string
  ): Promise<ICommandResult | null> {
    try {
      const sessionData = await this.service.fetchSessionConfirmation(id);
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
