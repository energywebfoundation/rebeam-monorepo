import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { IBridge, stopBridge, tokenType } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { CacheModule } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';

describe('ChargeService', () => {
  let chargeService: ChargeService;
  let bridge: IBridge;
  let ocnDbService: OcnDbService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Auth),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Endpoint),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Session),
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
        OcnDbService,
        OcnBridgeProvider,
        ChargeService,
        OcnApiService,
        LoggerService,
      ],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
    }).compile();

    chargeService = module.get<ChargeService>(ChargeService);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
    ocnDbService = module.get<OcnDbService>(OcnDbService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  it('should be defined', () => {
    expect(chargeService).toBeDefined();
  });

  describe('status', () => {
    it('should return connected status', async () => {
      jest.spyOn(bridge.registry, 'isConnectedToNode').mockResolvedValue(true);
      const { connected } = await chargeService.getConnectionStatus();
      expect(connected).toBe(true);
    });

    it('should return the OCPI token from initiate', async () => {
      jest.spyOn(bridge.requests, 'startSession').mockResolvedValue({
        status_code: '2000',
        timestamp: new Date().toDateString(),
      });
      const result = await chargeService.initiate({
        locationId: '7e42736a-4287-4c1e-b883-9ff03ea622b5',
        evseId: '123',
      });
      expect(result).toBeTruthy();
    });
  });
  describe('fetch session data', () => {
    const mockDate = new Date();
    const mockSession = {
      _id: 2,
      country_code: 'DE',
      party_id: 'CPO',
      id: 'c63cc282-0235-4081-a337-ac256e658299',
      sessionId: '7e42736a-4287-4c1e-b883-9ff03ea622b5',
      currency: 'EUR',
      start_date_time: mockDate,
      end_date_time: null,
      kwh: 0.73,
      cdr_token: {
        uid: '7e42736a-4287-4c1e-b883-9ff03ea622b5',
        type: 'AD_HOC_USER' as tokenType,
        contract_id: 'DE-REB-7e42736a-4287-4c1e-b883-9ff03ea622b5',
      },
      auth_method: 'COMMAND',
      authorization_method: null,
      location_id: 'Loc14',
      evse_uid: 'CH-CPO-S14E100001',
      connector_id: 'S14E1Con1',
      meter_id: null,
      charging_periods: null,
      total_cost: null,
      status: 'ACTIVE',
      last_updated: mockDate,
    };

    it('should fetch session data for a given session id and format data', async () => {
      jest.spyOn(ocnDbService, 'getSession').mockResolvedValue(mockSession);
      const result = {
        start_date_time: mockDate,
        kwh: 0.73,
        last_updated: mockDate,
        id: 'c63cc282-0235-4081-a337-ac256e658299',
      };
      const formattedResult = await chargeService.fetchSessionData(
        '7e42736a-4287-4c1e-b883-9ff03ea622b5'
      );
      expect(formattedResult).toEqual(result);
    });
    it('should format the cost according to currency if cost is provided', async () => {
      const mockDataWithCost = Object.assign({}, mockSession, {
        total_cost: {
          excl_vat: 5.5,
        },
      });
      jest
        .spyOn(ocnDbService, 'getSession')
        .mockResolvedValue(mockDataWithCost);
      const formattedResult = await chargeService.fetchSessionData(
        '7e42736a-4287-4c1e-b883-9ff03ea622b5'
      );
      expect(formattedResult.formattedCost).toBeTruthy();
    });
  });

  describe('fetch session confimation', () => {
    it('should fetch session confirmation', async () => {
      const sessionId = '7e42736a-4287-4c1e-b883-9ff03ea622b5';
      const resultData = {
        command: 'START_SESSION',
        uid: sessionId,
        result: 'ACCEPTED',
      };
      await cache.set(`${sessionId}-auth`, resultData);
      const result = await chargeService.fetchSessionConfirmation(
        '7e42736a-4287-4c1e-b883-9ff03ea622b5'
      );
      expect(result).toEqual(resultData);
    });
  });
});
