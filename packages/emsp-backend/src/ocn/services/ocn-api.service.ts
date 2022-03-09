import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  IChargeDetailRecord,
  ICommandResult,
  IPluggableAPI,
  ISession,
} from '@energyweb/ocn-bridge';
import { Session } from '../schemas/session.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '../../logger/logger.service';
import { OcnDbService } from './ocn-db.service';

@Injectable()
export class OcnApiService implements IPluggableAPI {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Session)
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(OcnDbService) private dbService: OcnDbService
  ) {}

  /**
   * LOCATIONS OCPI MODULE
   * receiver interface allows CPO to send us locations (charge point metadata)
   */
  locations = {
    // TODO: RECEIVER needs to be implemented in OCN-BRIDGE
    // TODO: store received locations in database
  };

  /**
   * SESSIONS OCPI MODULE
   * receiver interface allows CPO to send us session updates
   */
  sessions = {
    receiver: {
      // TODO: implement PUT method (save sessions in database)
      update: async (session: ISession): Promise<void> => {
        const {
          cdr_token: { uid },
        } = session;
        const sessionFormatted = Object.assign({}, session, {
          session_token: uid,
        });
        this.logger.log(
          `[PUT session FORMATTED] ${JSON.stringify(
            sessionFormatted,
            null,
            2
          )}`,
          OcnApiService.name
        );
        await this.dbService.insertSession(sessionFormatted);
        return;
      },
      // TODO: patch needs to be implemented in OCN-BRIDGE
    },
  };

  /**
   * CDRS OCPI MODULE
   * receiver interface allows CPO to send us Charge Detail Records (invoicing data)
   */
  cdrs = {
    receiver: {
      // TODO: implement GET method (retrieve session from DB)
      get: async (
        countryCode: string,
        partyId: string,
        id: string
      ): Promise<IChargeDetailRecord> => {
        this.logger.log(
          `[GET cdrs] /${countryCode}/${partyId}/${id}}`,
          OcnApiService.name
        );
        return {} as IChargeDetailRecord;
      },
      // TODO: implement POST method (save cdrs to database)
      create: async (cdr: IChargeDetailRecord): Promise<void> => {
        const {
          cdr_token: { uid },
        } = cdr;
        const cdrFormatted = Object.assign({}, cdr, {
          session_token: uid,
        });
        await this.dbService.insertCDR(cdrFormatted);
        this.logger.log(
          `[POST cdrs] ${JSON.stringify(cdr, null, 2)}`,
          OcnApiService.name
        );
        return;
      },
    },
  };
  //Once you have the response for this, then start polling for session
  //If we cache this asyc result from CPO, then we have proof that we will get session updates rather than polling for session updates and not knowing if the session has been authorized. Once we get this response, we can tell user charging will start soon
  /**
   * COMMANDS OCPI MODULE
   * sender interface allows CPO to send us charge start confirmation asychronously
   */
  //Insert into cache manager here and then inject it into other service to get
  commands = {
    sender: {
      // TODO: implement POST method
      asyncResult: async (
        command: string,
        uid: string,
        result: ICommandResult
      ): Promise<void> => {
        this.logger.log(
          command,
          uid,
          JSON.stringify(result),
          'THIS IS THE RETURN FROM ASYNC RESULT'
        );
        const resultData = {
          command,
          result,
          uid,
        };
        await this.cacheManager.set(`${uid}-auth`, resultData);
        this.logger.log(
          `[POST commands AUTH ETC] /${command}/${uid}: ${JSON.stringify(
            result
          )}}`,
          OcnApiService.name
        );
        return;
      },
    },
  };
}
