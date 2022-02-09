import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { PresentationDTO } from './dtos/presentation.dto';

import { Cache } from 'cache-manager';
@Injectable()
export class PresentationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async cachePresentation(data: PresentationDTO): Promise<PresentationDTO> {
    const { ocpiTokenUID } = data;
    const stored = await this.cacheManager.set(ocpiTokenUID, data)
    console.log(stored, "THE STORED VALUE");
    const cachedPresentation = await this.cacheManager.get(ocpiTokenUID);
    return cachedPresentation as PresentationDTO;
  }

  async fetchPresentation(id: string): Promise<PresentationDTO | null> {
    const fetchedData = await this.cacheManager.get(id);
    return fetchedData ? fetchedData as PresentationDTO : null;
  }
}
