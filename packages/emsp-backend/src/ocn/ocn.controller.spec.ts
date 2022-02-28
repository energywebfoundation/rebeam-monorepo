import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from './services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnController } from './ocn.controller';
import { OcnBridgeProvider } from './providers/ocn-bridge.provider';
import { Auth } from './schemas/auth.schema';
import { Session } from './schemas/session.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { OcnDbService } from './services/ocn-db.service';
import { OcnService } from './services/ocn.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { IBridge, stopBridge } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ApiError, ApiErrorCode } from '../types/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

describe('OcnController', () => {
  let controller: OcnController;
  let service: OcnService;
  let bridge: IBridge;

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
        LoggerService,
        OcnDbService,
        OcnApiService,
        OcnBridgeProvider,
        OcnService,
      ],
      controllers: [OcnController],
    }).compile();

    controller = module.get<OcnController>(OcnController);
    service = module.get<OcnService>(OcnService);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
  });

  afterEach(async () => {
    await stopBridge(bridge);
  });

  describe('status', () => {
    it('should get connected status', async () => {
      jest
        .spyOn(service, 'getConnectionStatus')
        .mockResolvedValue({ connected: true });
      const { connected } = await controller.getConnection();
      expect(connected).toBe(true);
    });

    it('should return error if status check fails', async () => {
      jest
        .spyOn(service, 'getConnectionStatus')
        .mockImplementation(async () => {
          throw Error('Connection refused; localhost:8080');
        });
      try {
        await controller.getConnection();
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.BAD_GATEWAY);
        expect(code).toBe(ApiErrorCode.OCN_BRIDGE);
        expect(message).toBe(
          'The OCN Bridge failed to fetch the status. Are the desired RPC and OCN Nodes available?'
        );
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });

  describe('register', () => {
    it('should register on the OCN', async () => {
      const actualUrl = 'http://localhost:8080';
      const actualToken = randomUUID();
      jest.spyOn(service, 'register').mockImplementation(async (url, token) => {
        const actualTokenBs64 = Buffer.from(actualToken).toString('base64');
        expect(token).toBe(actualTokenBs64);
        expect(url).toBe(actualUrl);
        return;
      });
      await controller.register({ tokenA: actualToken, nodeURL: actualUrl });
    });
    it('should return error if registration token invalid', async () => {
      try {
        await controller.register({
          tokenA: 'abc123',
          nodeURL: 'http://localhost:8080',
        });
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(code).toBe(ApiErrorCode.BAD_PAYLOAD);
        expect(message).toBe('The request body failed validation');
        expect(error['details'][0]['context']['key']).toBe('tokenA');
      }
    });

    it('should return error if registration url invalid', async () => {
      try {
        await controller.register({
          tokenA: randomUUID(),
          nodeURL: 'some-url',
        });
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(code).toBe(ApiErrorCode.BAD_PAYLOAD);
        expect(message).toBe('The request body failed validation');
        expect(error['details'][0]['context']['key']).toBe('nodeURL');
      }
    });

    it('should return error if registration fails', async () => {
      jest.spyOn(service, 'register').mockImplementation(async () => {
        throw Error('Connection refused; localhost:8080');
      });
      try {
        await controller.register({
          tokenA: randomUUID(),
          nodeURL: 'http://localhost:8080',
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
          'The OCN Bridge failed to register. Are the desired RPC and OCN Nodes available?'
        );
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });
});
