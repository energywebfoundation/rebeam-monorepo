import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { OcnModule } from '../ocn/ocn.module';

@Module({
  imports: [OcnModule],
  controllers: [ChargeController],
  providers: [ChargeService],
})
export class ChargeModule {}
