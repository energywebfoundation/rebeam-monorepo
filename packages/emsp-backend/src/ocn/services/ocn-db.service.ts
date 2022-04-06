import { Injectable } from '@nestjs/common';
import {
  IPluggableDB,
  IVersionDetail,
  ISession,
  IChargeDetailRecord,
} from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../schemas/auth.schema';
import { Repository } from 'typeorm';
import { Endpoint } from '../schemas/endpoint.schema';
import { Session } from '../schemas/session.schema';
import { ChargeDetailRecord } from '../schemas/cdr.schema';

@Injectable()
/**
 * Generic database wrapper used to set/get OCPI authentication tokens and
 * endpoints used in OCPI requests (server and client)
 */
export class OcnDbService implements IPluggableDB {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(ChargeDetailRecord)
    private readonly cdrRepository: Repository<ChargeDetailRecord>
  ) {}

  async getTokenB(): Promise<string> {
    const found = await this.authRepository.findOne();
    return found?.tokenB ?? '';
  }

  async setTokenB(tokenB: string): Promise<void> {
    const bs64TokenB = Buffer.from(tokenB).toString('base64');
    await this.updateAuth({ tokenB: bs64TokenB });
    return;
  }

  async getTokenC(): Promise<string> {
    const found = await this.authRepository.findOne();
    return found?.tokenC ?? '';
  }

  async setTokenC(tokenC: string): Promise<void> {
    const bs64TokenC = Buffer.from(tokenC).toString('base64');
    await this.updateAuth({ tokenC: bs64TokenC });
    return;
  }

  async saveEndpoints(versionDetail: IVersionDetail): Promise<void> {
    await this.endpointRepository.insert(versionDetail.endpoints);
    return;
  }

  async getEndpoint(
    identifier: string,
    role: 'SENDER' | 'RECEIVER'
  ): Promise<string> {
    const found = await this.endpointRepository.findOne({
      identifier,
      role,
    });
    return found?.url ?? '';
  }

  async getCount(): Promise<number> {
    const count = await this.sessionRepository.count();
    return count;
  }

  private async updateAuth(update: Partial<Auth>) {
    const existent = await this.authRepository.findOne({ id: 0 });
    if (existent) {
      await this.authRepository.update({ id: 0 }, update);
    } else {
      await this.authRepository.insert(update);
    }
  }

  async insertSession(
    session: ISession & {
      session_token: string;
    }
  ) {
    await this.sessionRepository.insert(session);
  }

  async getSessionByToken(sessionID: string) {
    const sessionData = await this.sessionRepository.find({
      session_token: sessionID
    });
    return sessionData;
  }

  async getSessionById(id: string, countryCode: string, partyId: string) {
    const sessionData = await this.sessionRepository.find({
      id: id,
      party_id: partyId,
      country_code: countryCode
    });
    return sessionData;
  }

  async insertCDR(
    record: IChargeDetailRecord & {
      session_token: string;
    }
  ) {
    const cdr = await this.cdrRepository.insert(record);
    return cdr;
  }

  async updateSession(id: number, session: ISession) {
    await this.sessionRepository.update({ _id: id }, session);
  }
}
