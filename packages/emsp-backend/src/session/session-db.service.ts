import { Injectable } from '@nestjs/common';
import { IPluggableDB, IVersionDetail, ISession } from '@energyweb/ocn-bridge';
import { InjectRepository,  } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Session } from '../ocn/schemas/session.schema';

@Injectable()
/**
 * Generic database wrapper used to set/get OCPI authentication tokens and
 * endpoints used in OCPI requests (server and client)
 */
export class SessionDbService {
  constructor(
    @InjectRepository(Session) private readonly sessionRepository: Repository<Session>
  ) {}

  async getSessionsByDates (startDate: Date, endDate: Date): Promise<Session[]> {
      console.log(startDate, endDate, "THE DATES HERE")
      try {
      console.log(await this.sessionRepository.count(), "THE COUNT"); 
    //   const sessions = await this.sessionRepository.createQueryBuilder("s").where(`s.start_date_time BETWEEN '${new Date(startDate)} AND '${new Date(endDate)}`).getMany()
    const sessions = await this.sessionRepository.query('SELECT * from Session WHERE start_date_time > $1::timestamptz AND start_date_time < $2::timestamptz', [startDate, endDate]);
    console.log(sessions, "THE SESSONS")
    return sessions
      
      }catch (e) {
          console.log(e, "THE ERRR FROM DB")
      }
  }



 





 




}
