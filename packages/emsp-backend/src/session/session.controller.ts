import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  Param,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { Response as ExpressResponse } from 'express';

import { SessionService } from './session.service';
import { fstat } from 'fs';
//import { SessionService } from './session.service';
@ApiTags('Session')
@Controller('session')
export class SessionController {
  constructor(
    private readonly logger: LoggerService,
    private readonly sessionService: SessionService
  ) {}

  @Get('/:startDate/:endDate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch cached charging session presentation information',
  })
  @ApiResponse({ status: 200 })
  async fetchSessionData(
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
    @Res() res
  ): Promise<ExpressResponse> {
    try {
      const file = await this.sessionService.getSessionFile(startDate, endDate);
      res.set('Content-Type', 'text/csv');
      return res.send(file);
    } catch (err) {
      console.log(err, 'THE ERR');
      this.logger.error(`Cannot generate CSV file for session information`);
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.PRESENTATION,
          `Failure to generate CSV file for session information`,
          err.message
        )
      );
    }
  }
}
