import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { LocationService } from './location.service';
import { ClientLocationsDTO } from './dtos/client-location.dto';

@UsePipes(ValidationPipe)
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: LocationService,
  ) {}

  @Get('get-locations')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get list of locations for CPO',
  })
  @ApiResponse({ status: 200 })
  async getLocations(): Promise<ClientLocationsDTO> {
    try {
      const locations = await this.service.fetchLocations();
      return locations;
    } catch (err) {
      this.logger.error(`Cannot fetch locations for given CPO`);
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.OCN_BRIDGE,
          'The OCN Bridge failed to fetch locations. Are the desired RPC and OCN Nodes available?',
          err.message
        )
      );
    }
  }
}
