import {
  Controller,
  HttpCode,
  Get,
  Param,
  InternalServerErrorException,
  Response,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { Response as ExpressResponse } from 'express';
import { SessionService } from './session.service';
@UsePipes(ValidationPipe)
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
    summary:
      'Fetch cached charging session presentation information. Dates must follow RFC 3339 and be in UTC.',
  })
  @ApiResponse({ status: 200 })
  async fetchSessionData(
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
    @Response() res: ExpressResponse
  ): Promise<ExpressResponse> {
    try {
      const result = await this.sessionService.getSessionFile(
        startDate,
        endDate
      );
      const { data, dataLength } = result;
      if (dataLength > 0) {
        res.set('Content-Type', 'text/csv');
        return res.send(data);
      } else {
        res.send(result);
      }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.SESSION,
          `Failure to generate CSV file for session information`,
          err.message
        )
      );
    }
  }
}
