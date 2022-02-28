import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OcnApiService } from '../ocn/services/ocn-api.service';
import { Repository } from 'typeorm';
import { OcnBridgeProvider } from '../ocn/providers/ocn-bridge.provider';
import { OcnDbService } from '../ocn/services/ocn-db.service';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { IBridge, stopBridge, tokenType, ILocation, IOcpiResponse, connectorFormat, evseStatus, capabilities, connectorStandard, connectorPowerType } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { CacheModule } from '@nestjs/common';
import { LocationService } from './location.service';
import { Session } from 'inspector';
import { Auth } from '../ocn/schemas/auth.schema';
import { Endpoint } from '../ocn/schemas/endpoint.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';

describe('LocatiomService', () => {
	let locationService: LocationService;
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
				LocationService,
				OcnApiService,
				LoggerService,
			],
			imports: [
				CacheModule.register({
					ttl: +process.env.TTL_CACHE,
				}),
			],
		}).compile();

		locationService = module.get<LocationService>(LocationService);
		bridge = module.get<IBridge>(Providers.OCN_BRIDGE);
		ocnDbService = module.get<OcnDbService>(OcnDbService);
		cache = module.get<Cache>(CACHE_MANAGER);
	});

	afterEach(async () => {
		await stopBridge(bridge);
	});

	it('should be defined', () => {
		expect(locationService).toBeDefined();
	});

	describe('status', () => {
		it('should return connected status', async () => {
			jest.spyOn(bridge.registry, 'isConnectedToNode').mockResolvedValue(true);
			const { connected } = await locationService.getConnectionStatus();
			expect(connected).toBe(true);
		});


	});
	describe('fetch location data', () => {
		it('should return locations formatted for the client', async () => {
			const mockLocationReturn = {
				status_code: "code",
				timestamp: "123456",
				data: [
					{
						"country_code": "BE",
						"party_id": "BEC",
						"id": "LOC1",
						"publish": true,
						"name": "Gent Zuid",
						"address": "F.Rooseveltlaan 3A",
						"city": "Gent",
						"postal_code": "9000",
						"country": "BEL",
						"coordinates": {
							"latitude": "51.047599",
							"longitude": "3.729944"
						},
						"evses": [{
							"uid": "3256",
							"evse_id": "BE*BEC*E041503001",
							"status": "AVAILABLE" as evseStatus,
							"status_schedule": [],
							"capabilities": [
								"RESERVABLE" as capabilities
							],
							"connectors": [{
								"id": "1",
								"standard": "IEC_62196_T2" as connectorStandard,
								"format": "CABLE" as connectorFormat,
								"power_type": "AC_3_PHASE" as connectorPowerType,
								"max_voltage": 220,
								"max_amperage": 16,
								"tariff_ids": ["11"],
								"last_updated": "2015-06-29T20:39:09Z"
							}],
							"physical_reference": "1",
							"floor_level": "-1",
							"last_updated": "2015-06-29T20:39:09Z"
						}],
						"operator": {
							"name": "BeCharged"
						},
						"last_updated": "2015-06-29T20:39:09Z"
					}
				]
			}

			const formattedLocations = [{
				type: "Feature",
				properties: {
					id: "LOC1",
					stationName: "Gent Zuid",
					formattedAddress: "F.Rooseveltlaan 3A Gent, 9000",
					country: "BEL",
					evses: [{
						uid: "3256",
						evse_id: "BE*BEC*E041503001",
						status: "AVAILABLE",
						"status_schedule": [],
						"capabilities": [
							"RESERVABLE"
						],
						"connectors": [{
							"id": "1",
							"standard": "IEC_62196_T2",
							"format": "CABLE",
							"power_type": "AC_3_PHASE",
							"max_voltage": 220,
							"max_amperage": 16,
							"tariff_ids": ["11"],
							"last_updated": "2015-06-29T20:39:09Z"
						}],
						"physical_reference": "1",
						"floor_level": "-1",
						"last_updated": "2015-06-29T20:39:09Z"
					}],
					operator: {
						name: "BeCharged"
					},	
				},
				geometry: {
					type: "Point",
					coordinates: [3.729944, 51.047599]
				}
			}]
			jest.spyOn(bridge.requests, 'getLocations').mockResolvedValue(mockLocationReturn);
			const result = await locationService.fetchLocations();
			expect(result).toEqual({
				locations: formattedLocations
			});
		});
	});
});