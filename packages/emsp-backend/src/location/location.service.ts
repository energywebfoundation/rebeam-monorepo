import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ILocation } from '@energyweb/ocn-bridge';
import { IBridge, IOcpiParty } from '@energyweb/ocn-bridge';
import { Providers } from '../types/symbols';
import { ClientLocationsDTO } from './dtos/client-location.dto';
import { Repository } from 'typeorm';
import {Location} from "../ocn/schemas/location.schema";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LocationService implements OnModuleInit {
  constructor(@Inject(Providers.OCN_BRIDGE) private bridge: IBridge,
  @InjectRepository(Location)
  private readonly LocationRepository: Repository<Location>
  ) {}


  async onModuleInit(): Promise<void> {
	const recipient: IOcpiParty = {
		country_code: 'DE',
		party_id: 'CPO',
	  };
	  const locations = await this.bridge.requests.getLocations(recipient);
	  const { data } = locations;
	  const locationsFormatted = data.map(data => {
		  const evseStringified = JSON.stringify(data.evses)
		  return {...data, evses: evseStringified};
	  })
	  locationsFormatted.map(async loc => {
		  const savedLocation = await this.LocationRepository.findOne({
			  id: loc.id
		  })
		  if(savedLocation) {
			await this.LocationRepository.update(
				savedLocation._id,
				loc
			)
		  } else {
			  await this.LocationRepository.insert(loc)
		  }
	  })
  }

  async getConnectionStatus() {
    return {
      connected: await this.bridge.registry.isConnectedToNode(),
    };
  }

  async fetchLocations(): Promise<ClientLocationsDTO> {
    const recipient: IOcpiParty = {
      country_code: 'DE',
      party_id: 'CPO',
    };
    const locations = await this.bridge.requests.getLocations(recipient);
    const { data } = locations;
	
    const formattedLocations = data.map((loc: ILocation) => {
      console.log(typeof loc.evses, 'HE TYPE');
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
