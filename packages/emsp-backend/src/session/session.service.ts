import { Injectable } from '@nestjs/common';
import * as papaparse from 'papaparse';
import { SessionDbService } from './session-db.service';
import { SessionDataDTO } from './dtos/session-data.dto';

@Injectable()
export class SessionService {
  constructor(private readonly sessionDbService: SessionDbService) {}

  async getSessionFile(
    startDate: Date,
    endDate: Date
  ): Promise<SessionDataDTO> {
    const allSessions = await this.sessionDbService.getSessionsByDates(
      startDate,
      endDate
    );
    const dataLength = allSessions?.length;
    if (dataLength && dataLength > 0) {
      const csv = papaparse.unparse(allSessions, {
        header: true,
      });
      return {
        dataLength,
        data: csv,
      };
    } else {
      return {
        dataLength,
        data: 'No data found for the dates given',
      };
    }
  }
}
