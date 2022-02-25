import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../ocn/schemas/session.schema';

@Injectable()
export class ChargeDBService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async fetchSession(sessionId: string) {
    const sessionData = await this.sessionRepository.findOne({
      sessionId: sessionId,
    });
    return sessionData;
  }
}
