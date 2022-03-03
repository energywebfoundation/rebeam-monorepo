import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import {
  mockBridgeLocationReturn,
  mockDbLocationsReturn,
  formattedLocations,
} from './utils/spec-data-fixtures';

import { IBridge, stopBridge } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { CacheModule } from '@nestjs/common';
import { LocationService } from './location.service';
import { Session } from '../ocn/schemas/session.schema';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { LocationDbService } from './location-db.service';
import { Location } from '../ocn/schemas/location.schema';

describe('LocationService', () => {
  let locationService: LocationService;
  let bridge: IBridge;
  let locationDbService: LocationDbService;

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
          provide: getRepositoryToken(Location),
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
        LocationService,
        OcnApiService,
        LoggerService,
        LocationDbService,
      ],
      imports: [
        CacheModule.register({
          ttl: +process.env.TTL_CACHE,
        }),
      ],
    }).compile();
    locationService = module.get<LocationService>(LocationService);
    bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
    locationDbService = module.get<LocationDbService>(LocationDbService);
  });
  beforeEach(async () => {
    await stopBridge(bridge);
  });
  it('should be defined', () => {
    expect(locationService).toBeDefined();
  });

  describe('fetch location data from the Bridge given a CPO and partyId', () => {
    it('should return locations formatted for the client', async () => {
      jest
        .spyOn(bridge.requests, 'getLocations')
        .mockResolvedValue(mockBridgeLocationReturn);
      jest.spyOn(locationDbService, 'insertLocations').mockResolvedValue(1);
      const result = await locationService.getCPOLocations({
        countryCode: 'DE',
        partyId: 'CPO',
      });
      expect(result).toEqual(1);
    });
  });

  describe('fetch location data for client given a CPO', () => {
    it('should return locations formatted for the client', async () => {
      expect(1).toEqual(1);
      jest
        .spyOn(locationDbService, 'getLocationsByPartyId')
        .mockResolvedValue(mockDbLocationsReturn);
      const result = await locationService.fetchLocationsForClient('CPO');
      expect(result).toEqual({
        locations: formattedLocations,
      });
    });
  });
});
