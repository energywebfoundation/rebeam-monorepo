import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionController } from './session.controller';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ApiError, ApiErrorCode } from '../types/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import {SessionDbService} from "./session-db.service";
import { Response as ExpressResponse } from 'express';
import { ResponseOutput } from "mock-req-res";
import { mockCsvData } from "./spec-data/session-mock-data";

describe('SessionController', () => {
  let controller: SessionController;
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
        SessionDbService
      ],
      controllers: [SessionController],
    }).compile();

    controller = module.get<SessionController>(SessionController);
    sessionService = module.get<SessionService>(SessionService);
    sessionDbService = module.get<SessionDbService>(SessionDbService);
  });



  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get session data', () => {
    it('should send csv data if data is returned from service', async () => {
        const mockCallback = jest.fn((res) =>{
            expect(res).toBeDefined();
          });

        const mockSet = jest.fn((res) => {
            expect(res).toBeDefined
        })
        const res: ResponseOutput = {
            send: mockCallback, 
            set: mockSet
        }
        jest.spyOn(sessionService, "getSessionFile").mockResolvedValue({
            dataLength: 20,
            data: mockCsvData
        });
        await controller.fetchSessionData(new Date("2022-03-06T00:16:01.164Z"), new Date("2022-03-07T01:16:01.164Z"), res);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockSet).toHaveBeenCalledTimes(1);
      });
      it('should send not send csv data if no data returned from service', async () => {
        const mockCallback = jest.fn((res) =>{
            expect(res).toBeDefined();
          });

        const mockSet = jest.fn((res) => {
            expect(res).toBeDefined
        })
        const res: ResponseOutput = {
            send: mockCallback, 
            set: mockSet
        }
        jest.spyOn(sessionService, "getSessionFile").mockResolvedValue({
            dataLength: 0,
            data: "No data found for the dates given"
        });
        await controller.fetchSessionData(new Date("2022-03-06T00:16:01.164Z"), new Date("2022-03-07T01:16:01.164Z"), res);
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockSet).toHaveBeenCalledTimes(0);
      });
      it('should return an Internal Server error if the service fails', async () => {
        jest.spyOn(sessionService, "getSessionFile") .mockImplementation(async () => {
            throw Error('Connection refused; localhost:8080');
          });

          try {
            const mockCallback = jest.fn((res) =>{
                expect(res).toBeDefined();
              });
    
            const mockSet = jest.fn((res) => {
                expect(res).toBeDefined
            })
            const res: ResponseOutput = {
                send: mockCallback, 
                set: mockSet
            }
            await controller.fetchSessionData(new Date("2022-03-06T00:16:01.164Z"), new Date("2022-03-07T01:16:01.164Z"), res as ExpressResponse);
            throw Error('Test should not have passed!');
          } catch (err) {
            const status = (err as HttpException).getStatus();
            const { code, message, error } = (
              err as HttpException
            ).getResponse() as ApiError;
            expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(code).toBe(ApiErrorCode.SESSION);
            expect(message).toBe(
                `Failure to generate CSV file for session information`
            );
            expect(error).toBe('Connection refused; localhost:8080');
          }
      });
  })
  
});
