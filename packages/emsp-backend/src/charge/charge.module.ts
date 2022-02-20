import { Module } from '@nestjs/common';
import { ChargeController } from './charge.controller';
import { ChargeService } from './charge.service';
import { OcnModule } from '../ocn/ocn.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../ocn/schemas/session.schema';

@Module({
  imports: [OcnModule, TypeOrmModule.forFeature([Session])],
  controllers: [ChargeController],
  providers: [ChargeService],
})
export class ChargeModule {}
