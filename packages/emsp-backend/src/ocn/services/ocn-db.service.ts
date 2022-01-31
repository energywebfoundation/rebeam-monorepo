import { Injectable } from '@nestjs/common';
import { IPluggableDB, IVersionDetail } from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from '../schemas/auth.schema';
import { Repository } from 'typeorm';
import { Endpoint } from '../schemas/endpoint.schema';

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
  ) {}

  async getTokenB(): Promise<string> {
    const found = await this.authRepository.findOne();
    return found?.tokenB ?? '';
  }

  async setTokenB(tokenB: string): Promise<void> {
    await this.updateAuth({ tokenB });
    return;
  }

  async getTokenC(): Promise<string> {
    const found = await this.authRepository.findOne();
    return found?.tokenC ?? '';
  }

  async setTokenC(tokenC: string): Promise<void> {
    await this.updateAuth({ tokenC });
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
    return found?.url ?? ''
  }

  private async updateAuth(update: Partial<Auth>) {
    const existent = await this.authRepository.findOne({ id: 0 });
    if (existent) {
      await this.authRepository.update({ id: 0 }, update);
    } else {
      await this.authRepository.insert(update);
    }
  }
}
