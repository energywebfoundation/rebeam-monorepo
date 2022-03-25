import {
  connectorFormat,
  evseStatus,
  capabilities,
  connectorStandard,
  connectorPowerType,
  IOcpiResponse,
  ILocation,
} from '@energyweb/ocn-bridge';
import {
  ClientLocation,
  ClientLocationsDTO,
} from '../dtos/client-location.dto';
import { Location } from '../../ocn/schemas/location.schema';

export const mockBridgeLocationReturn: IOcpiResponse<ILocation[]> = {
  status_code: 'code',
  timestamp: '123456',
  data: [
    {
      country_code: 'BE',
      party_id: 'BEC',
      id: 'LOC1',
      publish: true,
      name: 'Gent Zuid',
      address: 'F.Rooseveltlaan 3A',
      city: 'Gent',
      postal_code: '9000',
      country: 'BEL',
      coordinates: {
        latitude: '51.047599',
        longitude: '3.729944',
      },
      evses: [
        {
          uid: '3256',
          evse_id: 'BE*BEC*E041503001',
          status: 'AVAILABLE' as evseStatus,
          status_schedule: [],
          capabilities: ['RESERVABLE' as capabilities],
          connectors: [
            {
              id: '1',
              standard: 'IEC_62196_T2' as connectorStandard,
              format: 'CABLE' as connectorFormat,
              power_type: 'AC_3_PHASE' as connectorPowerType,
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
      ],
      operator: {
        name: 'BeCharged',
      },
      last_updated: '2015-06-29T20:39:09Z',
    },
  ],
};

export const mockDbLocationsReturn: Partial<Location>[] = [
  {
    _id: 'string',
    country_code: 'BE',
    party_id: 'BEC',
    id: 'LOC1',
    publish: true,
    name: 'Gent Zuid',
    address: 'F.Rooseveltlaan 3A',
    city: 'Gent',
    postal_code: '9000',
    country: 'BEL',
    coordinates: {
      latitude: '51.047599',
      longitude: '3.729944',
    },
    evses: JSON.stringify([
      {
        uid: '3256',
        evse_id: 'BE*BEC*E041503001',
        status: 'AVAILABLE' as evseStatus,
        status_schedule: [],
        capabilities: ['RESERVABLE' as capabilities],
        connectors: [
          {
            id: '1',
            standard: 'IEC_62196_T2' as connectorStandard,
            format: 'CABLE' as connectorFormat,
            power_type: 'AC_3_PHASE' as connectorPowerType,
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
    last_updated: '2015-06-29T20:39:09Z',
  },
];

export const formattedLocations: ClientLocation[] = [
  {
    properties: {
      id: 'LOC1',
      partyId: 'CPO',
      countryCode: 'DE',
      stationName: 'Gent Zuid',
      formattedAddress: 'F.Rooseveltlaan 3A Gent, 9000',
      country: 'BEL',
      evses:
        '[{"uid":"3256","evse_id":"BE*BEC*E041503001","status":"AVAILABLE","status_schedule":[],"capabilities":["RESERVABLE"],"connectors":[{"id":"1","standard":"IEC_62196_T2","format":"CABLE","power_type":"AC_3_PHASE","max_voltage":220,"max_amperage":16,"tariff_ids":["11"],"last_updated":"2015-06-29T20:39:09Z"}],"physical_reference":"1","floor_level":"-1","last_updated":"2015-06-29T20:39:09Z"}]',
      operator: {
        name: 'BeCharged',
      },
    },
    geometry: {
      coordinates: [3.729944, 51.047599],
    },
  },
];

export const mockClientFormattedLocations: ClientLocationsDTO = {
  locations: [
    {
      properties: {
        countryCode: 'DE',
        partyId: 'CPO',
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
        coordinates: [123, 456],
      },
    },
  ],
};
