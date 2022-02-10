import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChargeService {
  async initiate(): Promise<string> {
    //Placeholder for call to Charge Operator to get a start session token:
    const mockOcpiToken = uuidv4();
    console.log(mockOcpiToken);
    return mockOcpiToken;
  }
}
