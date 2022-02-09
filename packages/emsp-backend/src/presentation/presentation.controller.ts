import { Body, Controller, Post, HttpCode, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PresentationDTO } from './dtos/presentation.dto';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { PresentationService } from './presentation.service';
@ApiTags('Presentation')
@Controller('presentation')
export class PresentationController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: LoggerService,
    private readonly service: PresentationService
  ) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Cache charging session presentation information',
  })
  @ApiResponse({ status: 200, type: PresentationDTO })
  async cachePresentation(
    @Body() data: PresentationDTO
  ): Promise<PresentationDTO> {
    try {
      //Cache the presentation data. The key is the OCPI token Id, the value is stringified presentation data:
      const cachedData = await this.service.cachePresentation(data);
      return cachedData;
    } catch (err) {
      this.logger.error(
        `Cannot cache presentation data for ${data.ocpiTokenUID}: ${err.message} `
      );
      throw new ApiError(
        ApiErrorCode.PRESENTATION,
        'Failure to cache presentation data',
        err.message
      );
    }
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch cached charging session presentation information',
  })
  @ApiResponse({ status: 200, type: PresentationDTO || null })
  async fetchPresentationData(
    @Param('id') id: string
  ): Promise<PresentationDTO | null> {
    try {
      const cachedData = await this.service.fetchPresentation(id);
      console.log(cachedData, 'should be null');
      return cachedData;
    } catch (err) {
      this.logger.error(
        `Cannot fetch cached presentation data for ${id}: ${err.message}`
      );
      throw new ApiError(
        ApiErrorCode.PRESENTATION,
        'Failure to fetch presentation data',
        err.message
      );
    }
  }
}
