import { Controller, Get, HttpCode, BadGatewayException, InternalServerErrorException, UsePipes, ValidationPipe} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { LocationService } from './location.service';
import { ClientLocationsDTO } from './dtos/client-location.dto';
import { ConnectionDto } from '../ocn/dtos/connection.dto';
import { OcnService } from '../ocn/services/ocn.service';
@UsePipes(ValidationPipe)
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: LocationService,
	private readonly ocnService: OcnService,
  ) {}

  @Get('status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Determine connection status of OCN Bridge' })
  @ApiResponse({ status: 200, type: ConnectionDto })
  async getConnection() {
    try {
      const status = await this.ocnService.getConnectionStatus();
      return status;
    } catch (err) {
      this.logger.error(
        `Cannot fetch OCN connection status: ${err.message}`,
        LocationController.name
      );
      throw new BadGatewayException(
        new ApiError(
          ApiErrorCode.OCN_BRIDGE,
          'The OCN Bridge failed to fetch the status. Are the desired RPC and OCN Nodes available?',
          err.message
        )
      );
    }
  }

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
