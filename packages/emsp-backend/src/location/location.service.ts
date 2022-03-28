import { Inject, Injectable } from '@nestjs/common';
import { IBridge, IOcpiParty } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ClientLocationsDTO } from './dtos/client-location.dto';
import { Location } from '../ocn/schemas/location.schema';
import { LocationDbService } from './location-db.service';
import { OcpiPartyDTO } from './dtos/ocpi-party.dto';

@Injectable()
export class LocationService {
  constructor(
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
    @Inject(LocationDbService) private locationDbService: LocationDbService
  ) {}

  async getCPOLocations(body: OcpiPartyDTO): Promise<number> {
    const recipient: IOcpiParty = {
      country_code: body.countryCode,
      party_id: body.partyId,
    };
    const locations = await this.bridge.requests.getLocations(recipient);
    const { data } = locations;
    if (data) {
      const locationsFormatted = data?.map((data) => {
        const evseStringified = JSON.stringify(data.evses);
        return { ...data, evses: evseStringified };
      });
      const insertResult = await this.locationDbService.insertLocations(
        locationsFormatted
      );
      return insertResult;
    } else
      throw new Error('No locations found for given country code and party id');
  }

  async fetchLocationsForClient(): Promise<ClientLocationsDTO> {
    const locations = await this.locationDbService.getAllLocations();
    const formattedLocations = locations.map((loc: Location) => {
      return {
        properties: {
          partyId: loc.party_id,
          countryCode: loc.country_code,
          id: loc.id,
          stationName: loc.name,
          formattedAddress: `${loc.address} ${loc.city}, ${loc.postal_code}`,
          country: loc.country,
          evses: loc.evses,
          operator: loc.operator,
        },
        geometry: {
          coordinates: [+loc.coordinates.longitude, +loc.coordinates.latitude],
        },
      };
    });

    return {
      locations: formattedLocations,
    };
  }
}
