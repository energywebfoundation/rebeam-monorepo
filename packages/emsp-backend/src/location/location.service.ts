import { Inject, Injectable } from '@nestjs/common';
import { ILocation } from '@energyweb/ocn-bridge';
import { IBridge, IOcpiParty } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ClientLocationsDTO } from './dtos/client-location.dto';
@Injectable()
export class LocationService {
  constructor(@Inject(Providers.OCN_BRIDGE) private bridge: IBridge) {}

  async fetchLocations(): Promise<ClientLocationsDTO> {
    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    const locations = await this.bridge.requests.getLocations(recipient);
    const { data } = locations;
    const formattedLocations = data.map((loc: ILocation) => {
      return {
        type: 'Feature',
        properties: {
          id: loc.id,
          stationName: loc.name,
          formattedAddress: `${loc.address} ${loc.city}, ${loc.postal_code}`,
          country: loc.country,
          evses: loc.evses,
          operator: loc.operator,
        },
        geometry: {
          type: 'Point',
          coordinates: [+loc.coordinates.longitude, +loc.coordinates.latitude],
        },
      };
    });

    return {
      locations: formattedLocations,
    };
  }
}
