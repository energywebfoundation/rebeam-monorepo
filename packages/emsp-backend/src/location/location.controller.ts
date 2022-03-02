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

@UsePipes(ValidationPipe)
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: LocationService,
  ) {}

 //GET STORED LOCATIONS FOR CLIENT  
@Get('get-client-locations/:cpo')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Get list of locations for CPO from database and format for client',
  })
  @ApiResponse({ status: 200 })
  async getStoredLocations(
    @Param('cpo') cpo: string
  ): Promise<ClientLocationsDTO> {
    try {
      const locations = await this.service.fetchLocationsForClient(cpo);
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

  //GET LOCATIONS FROM BRIDGE
  @Post('fetch-locations')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get list of locations for CPO and store in database',
  })
  @ApiResponse({ status: 200 })
  async getCPOLocations(@Body() body: OcpiPartyDTO): Promise<void> {
    try {
      await this.service.getCPOLocations(body);
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
}
