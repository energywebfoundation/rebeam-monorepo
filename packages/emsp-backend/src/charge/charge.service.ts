import { Inject, Injectable, CACHE_MANAGER, CacheModule } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionDTO } from './dtos/session.dto';
import { Session } from '../ocn/schemas/session.schema';
import {
  IBridge,
  IStartSession,
  ITokenType,
  ICommandResult,
} from '@energyweb/ocn-bridge';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  //unit test
  async initiate(locationId: string): Promise<string> {
    //Start Session Object needed from OCPI: https://github.com/ocpi/ocpi/blob/master/mod_commands.asciidoc#mod_commands_startsession_object
    //Placeholder for call to Charge Operator to get a start session token:
    const mockOcpiToken = randomUUID();
    const lastUpdated = Date.now();
    const token = {
      country_code: 'DE',
      party_id: 'REB',
      uid: mockOcpiToken,
      type: 'AD_HOC_USER' as ITokenType,
      contract_id: `DE-REB-${mockOcpiToken}`,
      issuer: 'ReBeam eMSP',
      valid: true,
      whitelist: 'NEVER',
      last_updated: lastUpdated.toString(),
    };
    const OCPIServerUrl = `process.env.OCN_OCPI_SERVER_BASE_URL/ocpi/sender/2.2/commands/START_SESSION/${mockOcpiToken}`;
    const startSessionData: IStartSession = {
      token,
      response_url: OCPIServerUrl,
      location_id: locationId,
    };

    // const startSessionRequest = await this.bridge.requests.startSession()

    return mockOcpiToken;
  }
  //unit test
  //endpoint to poll for response in cache. Once there, front end can poll for session updates.
  async fetchSessionData(sessionId: string): Promise<Session> {
    const sessionData = await this.SessionRepository.findOne({
      id: sessionId,
    });
    return sessionData;
  }

  async mockPostSessionData(data: SessionDTO) {
    const { id } = data;
    console.log(id, 'getting id');
    const savedSession = await this.SessionRepository.findOne({
      id: id,
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
