import { Injectable } from '@nestjs/common';
import {
  IChargeDetailRecord,
  ICommandResult,
  IPluggableAPI,
  ISession,
} from '@energyweb/ocn-bridge';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class OcnApiService implements IPluggableAPI {
  constructor(private readonly logger: LoggerService) {}

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

  /**
   * COMMANDS OCPI MODULE
   * sender interface allows CPO to send us charge start confirmation asychronously
   */
  commands = {
    sender: {
      // TODO: implement POST method
      asyncResult: async (
        command: string,
        uid: string,
        result: ICommandResult
      ): Promise<void> => {
        this.logger.log(
          `[POST commands] /${command}/${uid}: ${JSON.stringify(result)}}`,
          OcnApiService.name
        );
        return;
      },
    },
  };
}
