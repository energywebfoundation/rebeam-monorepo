import { Providers } from '../types/symbols';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as papaparse from 'papaparse';
import { IBridge } from '@energyweb/ocn-bridge';
import { SessionDbService } from './session-db.service';
import * as fs from 'fs';
import { SessionDataDTO } from './dtos/session-data.dto';

@Injectable()
export class SessionService {
  constructor(
    private readonly config: ConfigService,
    private readonly sessionDbService: SessionDbService
  ) {}

  async getSessionFile(
    startDate: Date,
    endDate: Date
  ): Promise<SessionDataDTO> {
    const allSessions = await this.sessionDbService.getSessionsByDates(
      startDate,
      endDate
    );
    console.log(JSON.stringify(allSessions), 'SESSIONS RETURNed');
    if (allSessions?.length > 0) {
      const csv = papaparse.unparse(allSessions, {
        header: true,
      });
      // fs.writeFileSync("./mock-data.json", csv)

      console.log(csv, 'THE CSV New');

      return {
        dataLength: allSessions.length,
        data: csv,
      };
    } else {
      console.log('IN THIS ELSE');
      return {
        dataLength: allSessions.length,
        data: 'No data found for the dates given',
      };
    }
  }
}
