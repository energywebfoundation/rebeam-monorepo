import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { OcnModule } from '../ocn/ocn.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../ocn/schemas/location.schema';
import { LocationDbService } from './location-db.service';

@Module({
  imports: [OcnModule, TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, LocationDbService],
})
export class LocationModule {}
