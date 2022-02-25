import { Controller, Post, Get, HttpCode, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { LocationService } from './location.service';
import { IOcpiResponse, ILocation } from '@energyweb/ocn-bridge';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: LocationService
  ) {}

  @Get('get-locations')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get list of locations for CPO',
  })
  @ApiResponse({ status: 200 })
  async startCharge(): Promise<IOcpiResponse<ILocation[]>> {
    try {
      const locations = await this.service.fetchLocations();
      return locations;
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
