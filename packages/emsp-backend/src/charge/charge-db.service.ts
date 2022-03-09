import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChargeDetailRecord } from '../ocn/schemas/cdr.schema';

@Injectable()
export class ChargeDbService {
  constructor(
    @InjectRepository(ChargeDetailRecord)
    private readonly cdrRepository: Repository<ChargeDetailRecord>
  ) {}
  async getSessionCDR(token: string): Promise<ChargeDetailRecord> {
    const session = await this.cdrRepository.findOne({
      session_token: token,
    });
    return session;
  }
}
