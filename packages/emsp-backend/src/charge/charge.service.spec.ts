import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import {
  IBridge,
  IConnector,
  IOcpiResponse,
  IStopSession,
  IToken,
  ITokenType,
  stopBridge,
  tokenType,
  IChargeDetailRecord,
  connectorStandard,
  connectorFormat,
  connectorPowerType,
} from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { CacheModule } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';
import { ChargeDetailRecord } from '../ocn/schemas/cdr.schema';
import { ChargeDbService } from './charge-db.service';

describe('ChargeService', () => {
  let chargeService: ChargeService;
  let bridge: IBridge;
  let ocnDbService: OcnDbService;
  let cache: Cache;
  let chargeDbService: ChargeDbService;

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
          provide: getRepositoryToken(ChargeDetailRecord),
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
        ChargeDbService,
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
    chargeDbService = module.get<ChargeDbService>(ChargeDbService);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  it('should be defined', () => {
    expect(chargeService).toBeDefined();
  });

  describe('initiate session', () => {
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
    const mockDate = new Date('1995-12-17T03:24:00');
    const mockSession = {
      _id: 2,
      country_code: 'DE',
      party_id: 'CPO',
      id: 'c63cc282-0235-4081-a337-ac256e658299',
      session_token: '7e42736a-4287-4c1e-b883-9ff03ea622b5',
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
        formattedCost: undefined,
        formattedStartTime: 'December 17th, 1995 3:24am',
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
  describe('stop session', () => {
    it('should return the OCPI response from stop session', async () => {
      const mockResultData = {
        data: {
          result: 'ACCEPTED',
          timeout: 30,
        },
        status_code: '1000',
        timestamp: '2022-03-08T22:00:32.719Z',
      };
      jest
        .spyOn(bridge.requests, 'stopSession')
        .mockResolvedValue(mockResultData as IOcpiResponse<undefined>);

      const result = await chargeService.stopSession({
        id: 'mockId',
        token: 'mockToken',
      });

      expect(result).toEqual(mockResultData);
    });
  });
  describe('fetch and format cdr data', () => {
    it('should fetch and format cdr data from the client', async () => {
      const mockResultData = {
        _id: 4,
        country_code: 'DE',
        party_id: 'CPO',
        id: '257b6ba8-e40a-4b92-8633-f79af596bc32',
        start_date_time: new Date('2022-03-08T22:29:18.904Z'),
        end_date_time: new Date('2022-03-08T22:30:52.922Z'),
        session_id: 'c2890d35-8686-4e4e-b44d-8b72e11a2fb2',
        session_token: 'c2402e36-0cca-4eb9-b5cd-32eed50ebf63',
        cdr_token: {
          uid: 'c2402e36-0cca-4eb9-b5cd-32eed50ebf63',
          type: 'AD_HOC_USER' as ITokenType,
          contract_id: 'DE-REB-c2402e36-0cca-4eb9-b5cd-32eed50ebf63',
        },
        auth_method: 'COMMAND',
        authorization_reference: null,
        token: null,
        cdr_location: {
          id: 'Loc14',
          address: 'Scharnhorststrasse 34-37',
          city: 'Berlin',
          postal_code: '10115',
          country: 'DEU',
          coordinates: { latitude: '52.54154', longitude: '13.38588' },
          evse_uid: 'CH-CPO-S14E100001',
          evse_id: 'CH-CPO-S14E100001',
          connector_id: 'S14E1Con1',
          connector_standard: 'IEC_62196_T2' as connectorStandard,
          connector_format: 'SOCKET' as connectorFormat,
          connector_power_type: 'AC_3_PHASE' as connectorPowerType,
        },
        meter_id: null,
        currency: 'EUR',
  
        tariffs: [
          {
            country_code: 'DE',
            party_id: 'CPO',
            id: '3',
            currency: 'CHF',
            elements: [
              {
                price_components: [
                  { type: 'FLAT', price: 8, vat: 0.077, step_size: 1 },
                ],
              },
            ],
            last_updated: '2022-03-08T21:43:15.860Z',
          },
        ],
        signed_data: null,
        total_cost: { excl_vat: 8, incl_vat: 8.62 },
        total_fixed_cost: null,
        total_energy: 0.57,
        total_energy_cost: null,
        total_time: 0.03,
        total_time_cost: null,
        total_parking_time: null,
        total_parking_cost: null,
        total_reservation_cost: null,
        remark: null,
        invoice_reference_id: null,
        credit: null,
        credit_reference_id: null,
        last_updated: '2022-03-08T22:30:52.922Z',
      };
      jest
        .spyOn(chargeDbService, 'getSessionCDR')
        .mockResolvedValue(mockResultData as ChargeDetailRecord);

      const result = await chargeService.fetchSessionCdr('c2402e36-0cca-4eb9-b5cd-32eed50ebf63');
      const mockFormattedResult = {"formattedEndTime":"March 8th, 2022 5:30pm","formattedCost":"8,00 €","sessionToken":"c2402e36-0cca-4eb9-b5cd-32eed50ebf63","id":"c2402e36-0cca-4eb9-b5cd-32eed50ebf63"}
      expect(result).toEqual(mockFormattedResult);
    });
  });
});
