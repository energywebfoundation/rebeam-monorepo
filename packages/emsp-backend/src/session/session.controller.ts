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
  import { Response as ExpressResponse } from "express";

import { SessionService } from './session.service';
  //import { SessionService } from './session.service';
  @ApiTags('Session')
  @Controller('session')
  export class SessionController {
	constructor(
	  private readonly logger: LoggerService,
      private readonly sessionService: SessionService,
	) {}
  
	@Get('/:startDate/:endDate')
	@HttpCode(200)
	@ApiOperation({
	  summary: 'Fetch cached charging session presentation information',
	})
	@ApiResponse({ status: 200})
	async fetchSessionData(
	  @Param('startDate') startDate: Date, @Param('endDate') endDate: Date, @Res() res
	): Promise<ExpressResponse> {
		console.log("can make it here")
		console.log(startDate.getMonth())
	  try {
		console.log(startDate, endDate, "are these coming through")
		const fileName = await this.sessionService.getSessionFile(startDate, endDate);
        const csvData = await this.sessionService.getExportedUserCSV(fileName);
        res.set("Content-Type", "text/csv");
        return res.send(csvData)

	  } catch (err) {
		console.log(err, "THE ERR")
		this.logger.error(
			
		  `Cannot fetch cached presentation data`
		);
		throw new InternalServerErrorException(
		  new ApiError(
			ApiErrorCode.PRESENTATION,
			`Failure to fetch presentation data for`,
			err.message
		  )
		);
	  }
	}
  }
  