import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';
import { Request, Response } from 'express';
import { PresentationDTO } from './presentation.dto';

import { ConfigService } from '@nestjs/config';

@ApiTags('presentation')
@Controller('presentation')
export class PresentationController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService
  ) {}

  @Post()
  async present(@Body() presentation: PresentationDTO) {
    console.log(presentation, 'THE REQUEST');
    return presentation;
  }
}
