import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../ocn/schemas/location.schema';
import { Repository } from 'typeorm';

@Injectable()
export class LocationDbService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>
  ) {}

  async insertLocations(locations: Partial<Location>[]): Promise<number> {
    await Promise.all(
      locations.map(async (loc) => {
        const savedLocation = await this.locationRepository.findOne({
          id: loc.id,
        });
        if (savedLocation) {
          await this.locationRepository.update(savedLocation._id, loc);
        } else {
          await this.locationRepository.insert(loc);
        }
      })
    );
    return this.locationRepository.count();
  }
  async getLocationsByPartyId(partyId: string): Promise<Partial<Location>[]> {
    const locations = await this.locationRepository.find({
      party_id: partyId.toUpperCase(),
    });
    return locations;
  }
}
