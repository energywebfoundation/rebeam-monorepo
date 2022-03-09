import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Session } from '../ocn/schemas/session.schema';

@Injectable()
export class SessionDbService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async getSessionsByDates(startDate: Date, endDate: Date): Promise<Session[]> {
    const sessions = await this.sessionRepository.query(
      'SELECT * from Session WHERE start_date_time > $1::timestamptz AND start_date_time < $2::timestamptz',
      [startDate, endDate]
    );
    return sessions;
  }
}
