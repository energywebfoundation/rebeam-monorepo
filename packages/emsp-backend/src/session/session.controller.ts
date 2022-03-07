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
    summary: 'Fetch cached charging session presentation information',
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
      console.log(result, 'THE RESULT');
      const { data, dataLength } = result;
      if (dataLength > 0) {
        console.log(dataLength, 'shouldnt be length!!!!!');
        res.set('Content-Type', 'text/csv');
        return res.send(data);
      } else {
        console.log('in this else');
        res.send(result);
      }
    } catch (err) {
      console.log(err, 'THE ERR');
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
