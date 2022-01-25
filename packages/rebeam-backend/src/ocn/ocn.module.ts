import { Module } from '@nestjs/common';
import { OcnService } from './ocn.service';

@Module({
  providers: [OcnService],
})
export class OcnModule {}
