import { Injectable } from '@nestjs/common';
import { IPluggableDB, IEndpoint, IVersionDetail } from '@energyweb/ocn-bridge';

@Injectable()
/**
 * Generic database wrapper used to set/get OCPI authentication tokens and
 * endpoints used in OCPI requests (server and client)
 */
export class OcnDbService implements IPluggableDB {
  private _tokenB: string;
  private _tokenC: string;
  private _endpoints: IEndpoint[];

  async getTokenB(): Promise<string> {
    // TODO: fetch from database
    return this._tokenB;
  }

  async setTokenB(tokenB: string): Promise<void> {
    // TODO: store in database
    this._tokenB = tokenB;
    return;
  }

  async getTokenC(): Promise<string> {
    // TODO: fetch from database
    return this._tokenC;
  }

  async setTokenC(tokenC: string): Promise<void> {
    // TODO: store in database
    this._tokenC = tokenC;
    return;
  }

  async saveEndpoints(versionDetail: IVersionDetail): Promise<void> {
    // TODO: save in database
    this._endpoints = versionDetail.endpoints;
    return;
  }

  async getEndpoint(
    identifier: string,
    role: 'SENDER' | 'RECEIVER'
  ): Promise<string> {
    // TODO: fetch from database
    const endpoint = this._endpoints.find(
      (e) => e.identifier === identifier && e.role === role
    );
    if (!endpoint) {
      throw Error(`Endpoint for ${identifier} ${role} not found`);
    }
    return endpoint.url;
  }
}
