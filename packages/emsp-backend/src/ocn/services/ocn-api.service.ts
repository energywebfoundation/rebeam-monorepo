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
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class OcnApiService implements IPluggableAPI {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Session)
    private readonly SessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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
        this.logger.log(
          `[PUT sessions] ${JSON.stringify(session, null, 2)}`,
          OcnApiService.name
        );
        const savedSession = await this.SessionRepository.findOne({
          id: session.id,
        });
        if (savedSession) {
          await this.SessionRepository.update(
            { _id: savedSession._id },
            session
          );
        } else {
          await this.SessionRepository.insert(session);
        }
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
        console.log(
          `THE RESULT FROM POST: ${uid}, ${command}, result: ${result}`
        );
        await this.cacheManager.set(uid, result);
        this.logger.log(
          `[POST commands] /${command}/${uid}: ${JSON.stringify(result)}}`,
          OcnApiService.name
        );
        return;
      },
    },
  };
}
