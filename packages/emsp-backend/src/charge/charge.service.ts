import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class ChargeService {
  async initiate(): Promise<string> {
    //Placeholder for call to Charge Operator to get a start session token:
    const mockOcpiToken = randomUUID();
    return mockOcpiToken;
  }
}
