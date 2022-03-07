import { Providers } from '../types/symbols';
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { promisify } from 'util';
import * as papaparse from 'papaparse';
import { IBridge } from '@energyweb/ocn-bridge';
import { SessionDbService } from './session-db.service';

@Injectable()
export class SessionService {
  constructor(
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
    private readonly config: ConfigService,
    private readonly sessionDbService: SessionDbService
  ) {}

  async getSessionFile(startDate: Date, endDate: Date) {
    const allSessions = await this.sessionDbService.getSessionsByDates(
      startDate,
      endDate
    );
    console.log(allSessions, 'SESSIONS RETURNed');
    // if (allSessions?.length) {
    const csv = papaparse.unparse(allSessions, {
      header: true,
    });
    console.log(csv, 'THE CSV New');
    return csv;
    // }
  }
}

//https://medium.com/the-crowdlinker-chronicle/creating-writing-downloading-files-in-nestjs-ee3e26f2f726
