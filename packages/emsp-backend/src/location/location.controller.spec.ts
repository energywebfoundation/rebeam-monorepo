import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { LocationController } from './location.controller';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { IBridge, stopBridge } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ApiError, ApiErrorCode } from '../types/types';
import { HttpException, HttpStatus, CacheModule } from '@nestjs/common';
import { LocationService } from './location.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { ClientLocationsDTO } from './dtos/client-location.dto';
import { OcnService } from '../ocn/services/ocn.service';
import { LocationDbService } from './location-db.service';

describe('LocationController', () => {
  let controller: LocationController;
  let locationService: LocationService;

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
        OcnBridgeProvider,
        OcnApiService,
        LocationService,
        OcnDbService,
        OcnService,
        LocationDbService,
      ],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
      controllers: [LocationController],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
  });

  //   it('should be defined', () => {
  //     expect(controller).toBeDefined();
  //   });
  describe('Get and store locations for a given CPO', () => {
    it('should fetch and store locations for a given CPO and country code', async () => {
      jest.spyOn(locationService, 'getCPOLocations').mockResolvedValue(true);
      const result = await controller.getCPOLocations({
        partyId: 'CPO',
        countryCode: 'DE',
      });
      expect(result).toEqual(true);
    });
    it('should return a Bad Gateway error if the Get Locations request fails', async () => {
      jest
        .spyOn(locationService, 'getCPOLocations')
        .mockImplementation(async () => {
          throw Error('Connection refused; localhost:8080');
        });
      try {
        await controller.getCPOLocations({
          partyId: 'CPO',
          countryCode: 'DE',
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
          'The OCN Bridge failed to fetch locations. Are the desired RPC and OCN Nodes available?'
        );
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });

  describe('Get locations for a given CPO', () => {
    const mockLocations: ClientLocationsDTO = {
      locations: [
        {
          type: 'Feature',
          properties: {
            id: 'string',
            stationName: 'Name',
            formattedAddress: 'formatted address',
            country: 'DE',
            evses: JSON.stringify([
              {
                uid: '3256',
                evse_id: 'BE*BEC*E041503001',
                status: 'AVAILABLE',
                status_schedule: [],
                capabilities: ['RESERVABLE'],
                connectors: [
                  {
                    id: '1',
                    standard: 'IEC_62196_T2',
                    format: 'CABLE',
                    power_type: 'AC_3_PHASE',
                    max_voltage: 220,
                    max_amperage: 16,
                    tariff_ids: ['11'],
                    last_updated: '2015-06-29T20:39:09Z',
                  },
                ],
                physical_reference: '1',
                floor_level: '-1',
                last_updated: '2015-06-29T20:39:09Z',
              },
            ]),
            operator: {
              name: 'BeCharged',
            },
          },
          geometry: {
            type: 'Point',
            coordinates: [123, 456],
          },
        },
      ],
    };
    it('should fetch and return formatted locations for a given CPO', async () => {
      jest
        .spyOn(locationService, 'fetchLocationsForClient')
        .mockResolvedValue(mockLocations);
      const result = await controller.getStoredLocations('CPO');
      expect(result).toEqual(mockLocations);
    });
    it('should return a Server Error error if the Get Stored Locations request fails', async () => {
      jest
        .spyOn(locationService, 'fetchLocationsForClient')
        .mockImplementation(async () => {
          throw Error('Connection refused; localhost:8080');
        });
      try {
        await controller.getStoredLocations('CPO');
        throw Error('Test should not have passed!');
      } catch (err) {
        const status = (err as HttpException).getStatus();
        const { code, message, error } = (
          err as HttpException
        ).getResponse() as ApiError;
        expect(status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(code).toBe(ApiErrorCode.LOCATION_FETCH);
        expect(message).toBe('Failed to fetch locations from database');
        expect(error).toBe('Connection refused; localhost:8080');
      }
    });
  });
});
