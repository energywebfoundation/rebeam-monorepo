import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { IOcpiResponse, ILocation } from '@energyweb/ocn-bridge';
import { randomUUID } from 'crypto';
import { Location } from '../ocn/schemas/location.schema';
import { IBridge, IOcpiParty } from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Providers } from '../types/symbols';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly SessionRepository: Repository<Location>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(Providers.OCN_BRIDGE) private bridge: IBridge
  ) {}

  async getConnectionStatus() {
    return {
      connected: await this.bridge.registry.isConnectedToNode(),
    };
  }

  //unit test
  async fetchLocations(): Promise<any> {
    //Start Session Object needed from OCPI: https://github.com/ocpi/ocpi/blob/master/mod_commands.asciidoc#mod_commands_startsession_object
    //Placeholder for call to Charge Operator to get a start session token:

    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    let locations: IOcpiResponse<ILocation[]>;
    try {
      locations = await this.bridge.requests.getLocations(recipient);
      const { data } = locations;
      const formattedLocations = data.map((loc) => {
        console.log(loc.evses, 'ARE TEHSE STRINGS??????');
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
            coordinates: [
              +loc.coordinates.longitude,
              +loc.coordinates.latitude,
            ],
          },
        };
      });
      return {
        locations: formattedLocations,
      };
    } catch (error) {
      console.log(error, 'THE ERROR');
    }

    return locations;
  }
}
