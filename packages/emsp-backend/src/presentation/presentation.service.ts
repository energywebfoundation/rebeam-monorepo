import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { PresentationDTO } from './dtos/presentation.dto';
import { LoggerService } from '../logger/logger.service';

import { Cache } from 'cache-manager';
@Injectable()
export class PresentationService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: LoggerService
  ) {}

  async cachePresentation(data: PresentationDTO): Promise<PresentationDTO> {
    const { ocpiTokenUID } = data;
    await this.cacheManager.set(`${ocpiTokenUID}-present`, data);
    const cachedPresentation = await this.cacheManager.get(
      `${ocpiTokenUID}-present`
    );
    return cachedPresentation as PresentationDTO;
  }

  async fetchPresentation(id: string): Promise<string | null> {
    const fetchedData = await this.cacheManager.get(`${id}-present`);
    let transformedData = null;
    if (fetchedData) {
      this.logger.debug(`Presentation data fetched for ${id}`);
      const dataToString = JSON.stringify(fetchedData);
      transformedData = Buffer.from(dataToString).toString('base64');
    }
    return transformedData;
  }
}
