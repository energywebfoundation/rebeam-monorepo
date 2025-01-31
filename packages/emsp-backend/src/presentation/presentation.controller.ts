import {
  Body,
  Controller,
  Post,
  HttpCode,
  Get,
  Param,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PresentationDTO } from './dtos/presentation.dto';
import { PresentationEncodedDTO } from './dtos/presentationEncoded.dto';
import { LoggerService } from '../logger/logger.service';
import { ApiError, ApiErrorCode } from '../types/types';
import { PresentationService } from './presentation.service';
@ApiTags('Presentation')
@Controller('presentation')
export class PresentationController {
  constructor(
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
      this.logger.debug(`Presentation data to cache: ${data}`);
      //Cache the presentation data. The key is the OCPI token Id, the value is stringified presentation data:
      const cachedData = await this.service.cachePresentation(data);
      return cachedData;
    } catch (err) {
      this.logger.error(
        `Cannot cache presentation data for ${data.ocpiTokenUID}: ${err.message} `
      );
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.PRESENTATION,
          `Failure to cache presentation data for id ${data.ocpiTokenUID}`,
          err.message
        )
      );
    }
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Fetch cached charging session presentation information',
  })
  @ApiResponse({ status: 200, type: PresentationEncodedDTO || null })
  async fetchPresentationData(
    @Param('id') id: string
  ): Promise<PresentationEncodedDTO | null> {
    try {
      const cachedData = await this.service.fetchPresentation(id);
      if (cachedData) {
        await this.service.clearPresentationCache(id);
        return {
          presentationLinkEncoded: cachedData,
        };
      }
      return null;
    } catch (err) {
      this.logger.error(
        `Cannot fetch cached presentation data for ${id}: ${err.message}`
      );
      throw new InternalServerErrorException(
        new ApiError(
          ApiErrorCode.PRESENTATION,
          `Failure to fetch presentation data for id ${id}`,
          err.message
        )
      );
    }
  }
}
