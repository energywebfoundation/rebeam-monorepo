import { Injectable } from '@nestjs/common';
import { IVersionDetail, ISession } from '@energyweb/ocn-bridge';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from '../ocn/schemas/location.schema';
import { Repository } from 'typeorm';

@Injectable()
/**
 * Generic database wrapper used to set/get OCPI authentication tokens and
 * endpoints used in OCPI requests (server and client)
 */
export class LocationDbService {
	constructor(
		@InjectRepository(Location)
		private readonly locationRepository: Repository<Location>
	) { }

	async insertLocations(locations: Partial<Location>[]) {
		const result = await Promise.all(locations.map(async loc => {
			const savedLocation = await this.locationRepository.findOne({
				id: loc.id,
			});
			if (savedLocation) {
				await this.locationRepository.update(savedLocation._id, loc);
			} else {
				await this.locationRepository.insert(loc);
			}
		}));
	}
	async getLocationsByPartyId(partyId: string): Promise<Location[]> {
		const locations = await this.locationRepository.find({
			party_id: partyId
		});
				return locations;

	}
}
