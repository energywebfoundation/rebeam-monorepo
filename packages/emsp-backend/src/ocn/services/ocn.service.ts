import { Inject, Injectable } from '@nestjs/common';
import { IBridge } from '@energyweb/ocn-bridge';
import { LoggerService } from '../../logger/logger.service';
import { Providers } from '../../types/symbols';

@Injectable()
export class OcnService {
  constructor(
    @Inject(Providers.OCN_BRIDGE) private readonly bridge: IBridge,
    private readonly logger: LoggerService
  ) {}

  /**
   * Here we can define methods to send requests to the CPO using the OCN Bridge
   */
}
