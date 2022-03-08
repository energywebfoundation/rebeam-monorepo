import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { ChargeController } from './charge.controller';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import {
  IBridge,
  stopBridge,
  CommandResultType,
  IOcpiResponse,
} from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ApiError, ApiErrorCode } from '../types/types';
import { HttpException, HttpStatus, CacheModule } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { OcnService } from '../ocn/services/ocn.service';

describe('ChargeController', () => {
  let controller: ChargeController;
  let chargeService: ChargeService;
  let bridge: IBridge;
  let ocnService: OcnService;

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
        OcnDbService,
        OcnApiService,
        OcnService,
        OcnBridgeProvider,
        ChargeService,
      ],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
      controllers: [ChargeController],
    }).compile();

    controller = module.get<ChargeController>(ChargeController);
    chargeService = module.get<ChargeService>(ChargeService);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
    ocnService = module.get<OcnService>(OcnService);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('initiate charge', () => {
    it('should get session token', async () => {
      jest.spyOn(chargeService, 'initiate').mockResolvedValue('mockToken');
      const { ocpiToken } = await controller.startCharge({
        locationId: 'locationId',
        evseId: 'eveseId',
      });
      expect(ocpiToken).toEqual('mockToken');
    });
    it('should return an Internal Server error if the Start Session request fails', async () => {
      jest.spyOn(chargeService, 'initiate').mockImplementation(async () => {
        throw Error('Connection refused; localhost:8080');
      });
      try {
        await controller.startCharge({
          locationId: 'locationId',
          evseId: 'eveseId',
        });
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.OCN_BRIDGE);
        expect(message).toBe(
          'The OCN Bridge failed to start the charging session. Are the desired RPC and OCN Nodes available?'
        );
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });
  describe('fetch charge session data', () => {
    it('should get session token', async () => {
      const mockDate = new Date();
      const mockReturn = {
        start_date_time: mockDate,
        kwh: 0.64,
        formattedCost: '$5.00',
        last_updated: mockDate,
        id: '439e9741-5488-4ec2-b735-796229829719',
        formattedStartTime: 'Dec 12, 2021 4:00 PM',
      };
      jest
        .spyOn(chargeService, 'fetchSessionData')
        .mockResolvedValue(mockReturn);
      const sessionData = await controller.getChargeSessionData({
        sessionId: '90a7eeed-a020-4ea3-8f89-e70f48c23563',
      });
      expect(sessionData).toEqual(mockReturn);
    });
    it('should return an Internal Server error if the fetch session data request fails', async () => {
      jest
        .spyOn(chargeService, 'fetchSessionData')
        .mockImplementation(async () => {
          throw Error('Bad database request');
        });
      try {
        await controller.getChargeSessionData({
          sessionId: '90a7eeed-a020-4ea3-8f89-e70f48c23563',
        });
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.CHARGE_SESSION);
        expect(message).toBe(
          'Failure to fetch charge session data - check connection to database'
        );
        expect(error).toBe('Bad database request');
      }
    });
  });
  describe('fetch charge session confirmation', () => {
    it('should fetch and return the session confirmation', async () => {
      const mockResultData = {
        message: 'message',
        result: CommandResultType.ACCEPTED,
      };
      jest
        .spyOn(chargeService, 'fetchSessionConfirmation')
        .mockResolvedValue(mockResultData);
      const sessionData = await controller.getChargeSessionConfirmation(
        '90a7eeed-a020-4ea3-8f89-e70f48c23563'
      );
      expect(sessionData).toEqual(mockResultData);
    });
    it('should return an Internal Server error if the fetch auth confirmation request fails', async () => {
      jest
        .spyOn(chargeService, 'fetchSessionConfirmation')
        .mockImplementation(async () => {
          throw Error('No Connection to Cache');
        });
      try {
        await controller.getChargeSessionConfirmation(
          '90a7eeed-a020-4ea3-8f89-e70f48c23563'
        );
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.CHARGE_SESSION);
        expect(message).toBe('Failure to fetch charge session confirmation');
        expect(error).toBe('No Connection to Cache');
      }
    });
  });

  describe('stop session', () => {
    it('should initiate the stop session and return the stop session confirmation', async () => {
      const mockResultData = {
        data: {
          result: 'ACCEPTED',
          timeout: 30,
        },
        status_code: '1000',
        timestamp: '2022-03-08T22:00:32.719Z',
      };
      jest
        .spyOn(chargeService, 'stopSession')
        .mockResolvedValue(mockResultData as IOcpiResponse<undefined>);
      const sessionData = await controller.stopChargeSession({
        id: 'mockId',
        token: 'mockToken',
      });
      expect(sessionData).toEqual(mockResultData);
    });
    it('should return an Internal Server error if the stop session request fails', async () => {
      jest.spyOn(chargeService, 'stopSession').mockImplementation(async () => {
        throw Error('No Connection to OCN Bridge');
      });
      try {
        await controller.stopChargeSession({
          id: 'mockId',
          token: 'mockToken',
        });
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.BAD_GATEWAY);
        expect(code).toBe(ApiErrorCode.OCN_BRIDGE);
        expect(message).toBe(
          'The OCN Bridge failed to stop the charging session. Are the desired RPC and OCN Nodes available?'
        );
        expect(error).toBe('No Connection to Cache');
      }
    });
  });

  describe('get CDR data', () => {
    it('should fetch and return the formatted cdr data', async () => {
      const mockResultData = {
        formattedEndTime: 'March 8th, 2022 10:30pm',
        formattedCost: '8,00 €',
        sessionToken: 'c2402e36-0cca-4eb9-b5cd-32eed50ebf63',
        id: 'c2402e36-0cca-4eb9-b5cd-32eed50ebf63',
      };
      jest
        .spyOn(chargeService, 'fetchSessionCdr')
        .mockResolvedValue(mockResultData);
      const sessionData = await controller.getChargeSessionCDR('mockId');
      expect(sessionData).toEqual(mockResultData);
    });
    it('should return an Internal Server error if the request for cdr data fails', async () => {
      jest
        .spyOn(chargeService, 'fetchSessionCdr')
        .mockImplementation(async () => {
          throw Error('No connection to database');
        });
      try {
        await controller.getChargeSessionCDR('mockId');
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.CHARGE_SESSION);
        expect(message).toBe('Failure to fetch cdr data from database');
        expect(error).toBe('No connection to database');
      }
    });
  });
});
