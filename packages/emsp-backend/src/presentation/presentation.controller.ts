import { Body, Controller, Post, HttpCode, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PresentationDTO } from './dtos/presentation.dto';
import { Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
@ApiTags('Presentation')
@Controller('presentation')
export class PresentationController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: LoggerService
  ) {}
  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Cache charging session presentation information',
  })
  @ApiResponse({ status: 200, type: String })
  async present(@Body() data: PresentationDTO): Promise<string> {
    const presToString = JSON.stringify(data);
    const { ocpiTokenUID } = data;
    try {
      //Cache the presentation data. The key is the OCPI token Id, the value is stringified presentation data:
      await this.cacheManager.set(ocpiTokenUID, presToString);
    } catch (err) {
      this.logger.error(
        `Cannot cache presentation data for ${ocpiTokenUID}: ${err.message} `
      );
      throw new ApiError(
        ApiErrorCode.PRESENTATION,
        'Failure to cache presentation data',
        err.message
      );
    }
    try {
      const cachedPresentation = await this.cacheManager.get(ocpiTokenUID);
      return cachedPresentation as string;
    } catch (err) {
      this.logger.error(
        `Cannot fetch cached presentation data for ${ocpiTokenUID}: ${err.message}`
      );
      throw new ApiError(
        ApiErrorCode.PRESENTATION,
        'Failure to fetch presentation data',
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
  async getPresentationData(
    @Param('id') id: string
  ): Promise<PresentationDTO | null> {
    try {
      const cachedData = await this.cacheManager.get(id);
      return cachedData ? JSON.parse(cachedData as string) : null;
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
