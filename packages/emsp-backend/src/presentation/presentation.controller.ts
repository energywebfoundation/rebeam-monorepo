import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PresentationDTO } from './presentation.dto';

@ApiTags('presentation')
@Controller('presentation')
export class PresentationController {
  constructor() {}

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Provide the charging session presentation information',
  })
  @ApiResponse({ status: 200, type: PresentationDTO })
  async present(@Body() presentation: PresentationDTO) {
    console.log(`The Presentation: ${presentation}`);
    return presentation;
  }
}
