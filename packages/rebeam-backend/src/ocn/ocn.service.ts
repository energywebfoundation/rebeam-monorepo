import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wallet } from '@ethersproject/wallet';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class OcnService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.logger.log(
      `Starting OCPI Server on port ${this.config.get('ocn.ocpiServerPort')}`,
      OcnService.name
    );
    const { address } = new Wallet(config.get('ocn.signer'));
    this.logger.log(
      `Started OCPI Server with OCN signer(${address})`,
      OcnService.name
    );
  }
}
