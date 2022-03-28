import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SessionDTO } from './dtos/session.dto';
import { ClientSessionDTO } from './dtos/client-session.dto';
import { Session } from '../ocn/schemas/session.schema';
import { formatCurrency, formatTime } from './utils/formatters';
import {
  IBridge,
  IStartSession,
  ITokenType,
  ICommandResult,
  IOcpiParty,
  IStopSession,
  IOcpiResponse,
} from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Providers } from '../types/symbols';
import { SelectedChargePointDTO } from './dtos/selected-charge-point.dto';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { ConfigService } from '@nestjs/config';
import { ChargeSessionDTO } from './dtos/charge-session-dto';
import { ChargeDbService } from './charge-db.service';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class ChargeService {
  constructor(
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
    @Inject(OcnDbService) private dbService: OcnDbService,
    private readonly config: ConfigService,
    @Inject(ChargeDbService) private chargeDbService: ChargeDbService,
    private readonly logger: LoggerService
  ) {}

  async initiate(chargeData: SelectedChargePointDTO): Promise<string> {
    const { locationId, evseId, countryCode, partyId } = chargeData;
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
    this.logger.log(`[Initiate Charge EVSE ID]: ${evseId}`)
    const ocnOcpiBaseUrl = this.config.get<string>('OCN_OCPI_SERVER_BASE_URL');
    const OCPIServerUrl = `${ocnOcpiBaseUrl}/ocpi/sender/2.2/commands/START_SESSION/${mockOcpiToken}`;
    const startSessionData: IStartSession = {
      token,
      response_url: OCPIServerUrl,
      location_id: locationId,
      evse_uid: evseId,
    };
    const recipient: IOcpiParty = {
      country_code: countryCode,
      party_id: partyId,
    };
    this.logger.debug(
      `Initiating session request to recipient with counry code ${recipient.country_code} and party id ${recipient.party_id}`
    );
    await this.bridge.requests.startSession(recipient, startSessionData);
    return mockOcpiToken;
  }

  async fetchSessionData(sessionId: string): Promise<ClientSessionDTO | null> {
    const sessionData: Session[] = await this.dbService.getSession(sessionId);
    let mostRecentSession: Session;
    if (Array.isArray(sessionData) && sessionData.length) {
      mostRecentSession = sessionData.reduce((acc, curr, index) =>
        curr.last_updated > acc.last_updated && index ? curr : acc
      );
    }
    if (mostRecentSession) {
      this.logger.debug(`Recent session data found for ${sessionId}`);
      const data = mostRecentSession;
      const {
        start_date_time,
        kwh,
        total_cost,
        currency,
        last_updated,
        id,
        country_code,
      } = data;
      const formattedStartTime = formatTime(start_date_time);
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
      await this.SessionRepository.insert(data);
    }
  }

  async fetchSessionConfirmation(
    sessionId: string
  ): Promise<ICommandResult | null> {
    const chargeConfirmation = await this.cacheManager.get(`${sessionId}-auth`);
    if (chargeConfirmation) {
      this.logger.debug(
        `Session confirmation found for ${sessionId}: ${JSON.stringify(
          chargeConfirmation
        )}`
      );
    }
    return chargeConfirmation as ICommandResult;
  }

  async mockPostSessionAuth(id: string) {
    const resultData = {
      command: 'START_SESSION',
      uid: id,
      result: 'ACCEPTED',
    };
    await this.cacheManager.set(`${id}-auth`, resultData);
    const result = await this.cacheManager.get(`${id}-auth`);
    return result;
  }

  async stopSession(args: ChargeSessionDTO): Promise<IOcpiResponse<undefined>> {
    const ocnOcpiBaseUrl = this.config.get<string>('OCN_OCPI_SERVER_BASE_URL');
    const OcpiResponseUrl = `${ocnOcpiBaseUrl}/ocpi/sender/2.2/commands`;
    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    const body: IStopSession = {
      session_id: args.id,
      response_url: OcpiResponseUrl,
    };
    const response = await this.bridge.requests.stopSession(recipient, body);
    return response;
  }

  async fetchSessionCdr(id: string) {
    const cdr = await this.chargeDbService.getSessionCDR(id);
    if (cdr) {
      this.logger.debug(`Session CDR found for ${id}: ${JSON.stringify(cdr)}`);
      const {
        end_date_time,
        total_cost,
        currency,
        country_code,
        session_token,
      } = cdr;
      const formattedEndTime = formatTime(end_date_time);
      let formattedCost: string;
      if (total_cost?.excl_vat) {
        formattedCost = formatCurrency(
          country_code,
          total_cost?.excl_vat,
          currency
        );
      }
      const formattedData = {
        formattedEndTime,
        formattedCost,
        sessionToken: session_token,
        id,
      };
      return formattedData;
    }
    return;
  }
}
