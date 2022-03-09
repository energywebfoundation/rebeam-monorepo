import {
  Controller,
  Get,
  HttpCode,
  BadGatewayException,
  Body,
  Post,
  Param,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { LocationService } from './location.service';
import { ClientLocationsDTO } from './dtos/client-location.dto';
import { OcpiPartyDTO } from './dtos/ocpi-party.dto';
import { LocationRecordsDTO } from './dtos/location-records.dto';

@UsePipes(ValidationPipe)
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: LocationService
  ) {}

  @Post('fetch-locations')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get list of locations for CPO from OCN bridge and store in database. Called on application init.',
  })
  @ApiResponse({ status: 200 })
  async getCPOLocations(
    @Body() body: OcpiPartyDTO
  ): Promise<LocationRecordsDTO> {
    try {
      const result = await this.service.getCPOLocations(body);
      return {
        numLocations: result,
      };
    } catch (err) {
      this.logger.error(`Cannot fetch locations for given CPO`);
      throw new BadGatewayException(
        new ApiError(
          ApiErrorCode.OCN_BRIDGE,
          'The OCN Bridge failed to fetch locations. Are the desired RPC and OCN Nodes available?',
          err.message
        )
      );
    }
  }

  @Get('get-client-locations/:cpo')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get list of locations for a given party id from database and format for client',
  })
  @ApiResponse({ status: 200 })
  async getStoredLocations(): Promise<ClientLocationsDTO> {
    try {
      const locations = await this.service.fetchLocationsForClient();
      return locations;
    } catch (err) {
      this.logger.error(`Cannot fetch locations`);
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.LOCATION_FETCH,
          'Failed to fetch locations from database',
          err.message
        )
      );
    }
  }
}
