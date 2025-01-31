import { Test, TestingModule } from '@nestjs/testing';
import { PresentationController } from './presentation.controller';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { ApiError, ApiErrorCode } from '../types/types';

import { LoggerService } from '../logger/logger.service';
import { PresentationService } from './presentation.service';
describe('PresentationController', () => {
  let presController: PresentationController;
  let presService: PresentationService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PresentationController],
      providers: [LoggerService, PresentationService],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
    }).compile();

    presController = app.get<PresentationController>(PresentationController);
    presService = app.get<PresentationService>(PresentationService);
  });

  it('should be defined', () => {
    expect(presController).toBeDefined();
  });

  describe('cache presentation data', () => {
    const presentationInfo = {
      presentationLink: {
        type: 'string',
        url: 'string',
        ssiSession: 'string',
      },
      ocpiTokenUID: 'test5',
    };
    it('should return the presentation information that is cached', async () => {
      jest
        .spyOn(presService, 'cachePresentation')
        .mockResolvedValue(presentationInfo);
      const result = await presController.cachePresentation(presentationInfo);
      expect(result).toEqual(presentationInfo);
    });
    it('should return an Internal Server error if the Start Session request fails', async () => {
      jest
        .spyOn(presService, 'cachePresentation')
        .mockImplementation(async () => {
          throw Error('Connection refused; localhost:8080');
        });
      try {
        await presController.cachePresentation(presentationInfo);
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.PRESENTATION);
        expect(message).toBe('Failure to cache presentation data for id test5');
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });
  describe('fetch presentation data', () => {
    it('should return the cached presentation for a given id', async () => {
      jest
        .spyOn(presService, 'fetchPresentation')
        .mockResolvedValue('a base64 link encoded');
      const result = await presController.fetchPresentationData('string');
      expect(result).toEqual({
        presentationLinkEncoded: 'a base64 link encoded',
      });
    });
    it('should return an Intenral Server error if the cache fetch fails', async () => {
      jest
        .spyOn(presService, 'fetchPresentation')
        .mockImplementation(async () => {
          throw Error('Connection refused; localhost:8080');
        });
      try {
        await presController.fetchPresentationData('123');
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.PRESENTATION);
        expect(message).toBe('Failure to fetch presentation data for id 123');
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });
});
