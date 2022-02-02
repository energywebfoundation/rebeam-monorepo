import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/logger/logger.service';
import { ApiError, ApiErrorCode } from 'src/types/types';
import { ConnectionDto } from './dtos/connection.dto';
import { RegisterDto } from './dtos/register.dto';
import { OcnService } from './services/ocn.service';

@Controller('ocn')
@ApiTags('OCN Bridge')
export class OcnController {
  constructor(
    private readonly ocnService: OcnService,
    private readonly logger: LoggerService
  ) {}

  @Get('status')
  @HttpCode(200)
  @ApiOperation({ summary: 'Determine connection status of OCN Bridge' })
  @ApiResponse({ status: 200, type: ConnectionDto })
  async getConnection(): Promise<ConnectionDto> {
    // TODO: authenticate
    try {
      return this.ocnService.getConnectionStatus();
    } catch (err) {
      this.logger.error(
        `Cannot fetch OCN connection status: ${JSON.stringify(err)}`,
        OcnController.name
      );
      throw new InternalServerErrorException(err);
    }
  }

  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register the OCN Bridge' })
  @ApiResponse({ status: 200 })
  async register(@Body() body: RegisterDto) {
    // TODO: authenticate
    try {
      RegisterDto.validate(body);
    } catch (err) {
      throw new UnprocessableEntityException(
        new ApiError(
          ApiErrorCode.BAD_PAYLOAD,
          'The request body failed validation',
          err
        )
      );
    }
    try {
      const bs64TokenA = Buffer.from(body.tokenA).toString('base64');
      await this.ocnService.register(body.nodeURL, bs64TokenA);
    } catch (err) {
      this.logger.error(
        `Cannot register on OCN: ${JSON.stringify(err)}`,
        OcnController.name
      );
      throw new BadGatewayException(
        new ApiError(
          ApiErrorCode.OCN_BRIDGE,
          'The OCN Bridge failed to register. Are the desired RPC and OCN Nodes available?',
          err
        )
      );
    }
  }
}
