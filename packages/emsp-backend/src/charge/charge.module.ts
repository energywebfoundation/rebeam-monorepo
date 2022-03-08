import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { OcnModule } from '../ocn/ocn.module';
import { ChargeDbService } from './charge-db.service';

@Module({
  imports: [OcnModule],
  controllers: [ChargeController],
  providers: [ChargeService, ChargeDbService],
})
export class ChargeModule {}
