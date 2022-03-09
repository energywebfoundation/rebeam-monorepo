import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { SessionDbService } from './session-db.service';
import { mockSessionDbData } from './spec-data/session-mock-data';

describe('SessionService', () => {
  let sessionService: SessionService;
  let sessionDbService: SessionDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Session),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Endpoint),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              ({
                ocn: {
                  ocpiServerBaseUrl: 'http://localhost:8080',
                  ocpiServerPort: '8080',
                  signer:
                    '49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b',
                  environment: 'volta',
                },
              }[key]),
          },
        },
        LoggerService,
        SessionService,
        SessionDbService,
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
    sessionDbService = module.get<SessionDbService>(SessionDbService);
  });

  it('should be defined', () => {
    expect(sessionService).toBeDefined();
  });

  describe('fetch and parse session data', () => {
    it('should fetch seession data and return parsed data for CSV if there are sessions that meet the date requirements', async () => {
      jest
        .spyOn(sessionDbService, 'getSessionsByDates')
        .mockResolvedValue(mockSessionDbData);
      const result = await sessionService.getSessionFile(
        new Date(),
        new Date()
      );
      expect(result.data).toContain(
        '_id,country_code,party_id,id,sessionId,currency,start_date_time,end_date_time,kwh,cdr_token,auth_method,authorization_method,location_id,evse_uid,connector_id,meter_id,charging_periods,total_cost,status,last_updated'
      );
    });
    it('should return no data message if no data is found for given dates', async () => {
      jest.spyOn(sessionDbService, 'getSessionsByDates').mockResolvedValue([]);
      const result = await sessionService.getSessionFile(
        new Date(),
        new Date()
      );
      expect(result).toEqual({
        dataLength: 0,
        data: 'No data found for the dates given',
      });
    });
  });
});
