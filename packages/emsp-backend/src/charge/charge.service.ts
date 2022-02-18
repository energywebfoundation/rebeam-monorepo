import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IBridge,
  IStartSession,
  ITokenType,
  ICommandResult,
} from '@energyweb/ocn-bridge';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../ocn/schemas/session.schema';
import { Cache } from 'cache-manager';
@Injectable()
export class ChargeService {
  constructor(
    @Inject(OcnBridgeProvider)
    private readonly bridge: IBridge,
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  //endpoint to poll for response in cache. Once there, front end can poll for session updates.
  async fetchSessionData(sessionId: string): Promise<Session> {
    const sessionData = await this.SessionRepository.findOne({
      id: sessionId,
    });
    return sessionData;
  }

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

    const startSessionData: IStartSession = {
      token,
      response_url: 'What is this?',
      location_id: locationId,
    };

    // const startSessionRequest = await this.bridge.requests.startSession()

    return mockOcpiToken;

    /*
    //REQUIRED FOR START SESSION:
    response_url
    
    URL
    
    1
    
    URL that the CommandResult POST should be sent to. This URL might contain an unique ID to be able to distinguish between StartSession requests.
    
    ************
    token
    
    Token
    
    1
    
    Token object the Charge Point has to use to start a new session. The Token provided in this request is authorized by the eMSP.
    
    ************
    
    location_id
    
    CiString(36)
    
    1
    
    Location.id of the Location (belonging to the CPO this request is send to) on which a session is to be started.
    
    ************
    
    */
  }

  async fetchSessionConfirmation(
    sessionId: string
  ): Promise<ICommandResult | null> {
    const chargeConfirmation = await this.cacheManager.get(sessionId);
    return chargeConfirmation as ICommandResult;
  }
}
