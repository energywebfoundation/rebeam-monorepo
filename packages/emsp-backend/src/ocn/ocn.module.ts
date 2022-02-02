import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcnApiService } from './services/ocn-api.service';
import { OcnDbService } from './services/ocn-db.service';
import { OcnService } from './services/ocn.service';
import { Auth } from './schemas/auth.schema';
import { Endpoint } from './schemas/endpoint.schema';
import { OcnController } from './ocn.controller';
import { OcnBridgeProvider } from './providers/ocn-bridge.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Endpoint])],
  providers: [
    OcnApiService,
    OcnDbService,
    OcnBridgeProvider,
    OcnService,
  ],
  controllers: [OcnController],
})
export class OcnModule {}
