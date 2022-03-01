import { Injectable } from '@nestjs/common';
import { IPluggableDB, IVersionDetail, ISession } from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../schemas/auth.schema';
import { Repository } from 'typeorm';
import { Endpoint } from '../schemas/endpoint.schema';
import { Session } from '../schemas/session.schema';

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
    private readonly sessionRepository: Repository<Session>
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
      sessionId: string;
    }
  ) {
    const existent = await this.sessionRepository.findOne({
      id: session.id,
    });
    if (existent) {
      await this.sessionRepository.update({ _id: existent._id }, session);
      await this.sessionRepository.findOne({
        id: session.id,
      });
    } else {
      await this.sessionRepository.insert(session);
    }
  }

  async getSession(sessionID: string) {
    const sessionData = await this.sessionRepository.findOne({
      sessionId: sessionID,
    });
    return sessionData;
  }

  async updateSession(id: number, session: ISession) {
    await this.sessionRepository.update({ _id: id }, session);
  }
}
