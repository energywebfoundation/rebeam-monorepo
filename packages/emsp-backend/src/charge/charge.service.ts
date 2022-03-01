import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionDTO } from './dtos/session.dto';
import { ClientSessionDTO } from './dtos/client-session.dto';
import { Session } from '../ocn/schemas/session.schema';
import { formatCurrency, formatStartTime } from './utils/formatters';
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
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
    @Inject(OcnDbService) private dbService: OcnDbService,
   	private readonly config: ConfigService
  ) {}

  async initiate(chargeData: SelectedChargePointDTO): Promise<string> {
    const { locationId, evseId } = chargeData;
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
    const ocnOcpiBaseUrl = this.config.get<string>('OCN_OCPI_SERVER_BASE_URL');
    const OCPIServerUrl = `${ocnOcpiBaseUrl}/ocpi/sender/2.2/commands/START_SESSION/${mockOcpiToken}`;
    const startSessionData: IStartSession = {
      token,
      response_url: OCPIServerUrl,
      location_id: locationId,
      evse_uid: evseId,
    };
    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    await this.bridge.requests.startSession(recipient, startSessionData);
    return mockOcpiToken;
  }

  async fetchSessionData(sessionId: string): Promise<ClientSessionDTO | null> {
    const sessionData = await this.dbService.getSession(sessionId);
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
      const formattedStartTime = formatStartTime(start_date_time);
      let formattedCost: string;
      if (total_cost?.excl_vat) {
        formattedCost = formatCurrency(
          country_code,
          total_cost?.excl_vat,
          currency
        );
      }
      const formattedData = {
        start_date_time,
        kwh,
        formattedCost,
        last_updated,
        id,
        formattedStartTime,
      };
      return formattedData;
    }

    return null;
  }

  async mockPostSessionData(data: SessionDTO) {
    const { id } = data;
    const savedSession = await this.SessionRepository.findOne({
      cdr_token: {
        uid: id,
      },
    });
    if (savedSession) {
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
    }
  }

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
    return result;
  }
}
