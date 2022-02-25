import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionDTO } from './dtos/session.dto';
import { ClientSessionDTO } from './dtos/client-session.dto';
import { Session } from '../ocn/schemas/session.schema';
import {
  IBridge,
  IStartSession,
  ITokenType,
  ICommandResult,
  IOcpiParty,
} from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Providers } from '../types/symbols';
import { SelectedChargePointDTO } from './dtos/selected-charge-point.dto';
import { ChargeDBService } from './charge-db.service';
import { OcnDbService } from '../ocn/services/ocn-db.service';
@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(ChargeDBService) private chargeDBService: ChargeDBService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
    @Inject(OcnDbService) private dbService: OcnDbService
  ) {}

  async getConnectionStatus() {
    return {
      connected: await this.bridge.registry.isConnectedToNode(),
    };
  }

  //unit test
  async initiate(chargeData: SelectedChargePointDTO): Promise<string> {
    console.log(chargeData, 'charge data coming through!');
    const { locationId, evseId } = chargeData;
    //Start Session Object needed from OCPI: https://github.com/ocpi/ocpi/blob/master/mod_commands.asciidoc#mod_commands_startsession_object
    //Placeholder for call to Charge Operator to get a start session token:
    const mockOcpiToken = randomUUID();
    const token = {
      country_code: 'DE',
      party_id: 'REB',
      uid: mockOcpiToken,
      type: 'AD_HOC_USER' as ITokenType,
      contract_id: `DE-REB-${mockOcpiToken}`,
      issuer: 'ReBeam eMSP',
      valid: true,
      whitelist: 'ALWAYS',
      last_updated: new Date().toISOString(),
    };
    const OCPIServerUrl = `${process.env.OCN_OCPI_SERVER_BASE_URL}/ocpi/sender/2.2/commands/START_SESSION/${mockOcpiToken}`;
    console.log(process.env.OCN_OCPI_SERVER_BASE_URL, 'server url');
    const startSessionData: IStartSession = {
      token,
      response_url: OCPIServerUrl,
      location_id: locationId,
      evse_uid: evseId,
    };
    console.log(startSessionData, 'THE START SESSION DATA');
    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    try {
      const value = await this.bridge.requests.startSession(
        recipient,
        startSessionData
      );
      console.log(value, 'Value returned from start session request');
    } catch (error) {
      console.log(error, 'THE ERROR');
    }

    return mockOcpiToken;
  }
  //unit test
  //endpoint to poll for respponse in cache. Once there, front end can poll for session updates.
  async fetchSessionData(sessionId: string): Promise<ClientSessionDTO | null> {
    console.log('IN FETCH SESSION DATA');
    console.log('in service', sessionId);
    const sessionData = await this.dbService.getSession(sessionId);
    console.log(sessionData, 'session data found from get session!');
    if (sessionData) {
      const data = sessionData;
      const {
        start_date_time,
        kwh,
        total_cost,
        currency,
        last_updated,
        id,
        country_code,
      } = data;
      let formattedCost: string;
      if (total_cost?.excl_vat) {
        formattedCost = new Intl.NumberFormat(
          `${country_code.toLocaleLowerCase()}-${country_code.toUpperCase()}`,
          { style: 'currency', currency: currency }
        ).format(total_cost.excl_vat);
      }
      const formattedData = {
        start_date_time,
        kwh,
        formattedCost,
        last_updated,
        id,
      };
      return formattedData;
    }

    return null;
  }

  async mockPostSessionData(data: SessionDTO) {
    const { id } = data;
    console.log(id, 'getting id');
    const savedSession = await this.SessionRepository.findOne({
      cdr_token: {
        uid: id,
      },
    });
    if (savedSession) {
      console.log('there is a saved session');
      try {
        await this.SessionRepository.update(
          { _id: savedSession._id },
          data as Partial<Session>
        );
      } catch (e) {
        console.log(e, 'THE ERROR');
      }
    } else {
      const insert = await this.SessionRepository.insert(data);
      console.log(insert);
    }
  }

  //unit test
  async fetchSessionConfirmation(
    sessionId: string
  ): Promise<ICommandResult | null> {
    const chargeConfirmation = await this.cacheManager.get(`${sessionId}-auth`);
    return chargeConfirmation as ICommandResult;
  }

  async mockPostSessionAuth(id: string) {
    const resultData = {
      command: 'START_SESSION',
      uid: id,
      result: 'ACCEPTED',
    };
    await this.cacheManager.set(`${id}-auth`, resultData);
    const result = this.cacheManager.get(`${id}-auth`);
    console.log(result, 'RESULT FROM AUTH CACHE FETCH');
    return result;
  }
}
